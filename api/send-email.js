const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const DEFAULT_MAILBOX = 'sowyourseed@christgarden.church';

const seedTemplates = {
  faith: {
    html: 'assets/thank-you/Seeds_of_Faith_Gift_Email.html',
    attachments: ['assets/thank-you/Seeds_of_Faith.pdf']
  },
  love: {
    html: 'assets/thank-you/Seeds_of_Love_Gift_Email.html',
    attachments: ['assets/thank-you/Seeds_of_Love.pdf']
  },
  healing: {
    html: 'assets/thank-you/Seeds_of_Healing_Gift_Email.html',
    attachments: ['assets/thank-you/Seeds_of_Healing.pdf']
  },
  hope: {
    html: 'assets/thank-you/Seeds_of_Hope_Gift_Email.html',
    attachments: ['assets/thank-you/Seeds_of_Hope.pdf']
  },
  prayer: {
    html: 'assets/thank-you/Seeds_of_Prayer_Gift_Email.html',
    attachments: ['assets/thank-you/Seeds_of_Prayer.pdf']
  }
};

const giftFromUsTemplate = {
  html: 'gift-from-us-template.html',
  attachments: Object.values(seedTemplates).flatMap(template => template.attachments)
};

const templateCache = new Map();

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;'
  })[character]);
}

function personalizeHtml(html, name) {
  const safeName = escapeHtml(name || 'Believer');
  const personalized = html
    .replace(/\{\{\s*(?:name|recipient[_-]?name)\s*\}\}/gi, safeName);
  if (!name) return personalized;
  return personalized
    .replace(/\bBeliever\b/gi, safeName)
    .replace(/\bBeliver\b/gi, safeName);
}

function readBoolean(value, fallback) {
  if (value == null || value === '') return fallback;
  return /^(1|true|yes|on)$/i.test(value);
}

function readTemplate(relativePath) {
  if (!templateCache.has(relativePath)) {
    const filePath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(filePath)) throw new Error(`Email template not found: ${path.basename(relativePath)}`);
    templateCache.set(relativePath, fs.readFileSync(filePath, 'utf8'));
  }
  return templateCache.get(relativePath);
}

function resolveMessageContent(message) {
  let html = message.html;
  let attachmentNames = Array.isArray(message.attachments)
    ? message.attachments
    : message.attachments ? [message.attachments] : [];

  if (message.template === 'newsletter') {
    const template = seedTemplates[message.seed];
    if (!template) throw new Error('Unknown seed email template');
    html = readTemplate(template.html);
    attachmentNames = template.attachments;
  } else if (message.template === 'meeting') {
    html = readTemplate(giftFromUsTemplate.html);
    attachmentNames = giftFromUsTemplate.attachments;
  }

  if (!html) throw new Error('Email content is required');
  return { html: personalizeHtml(html, message.name), attachmentNames };
}

function createFileAttachments(attachmentNames) {
  return attachmentNames.map(relativePath => {
    const filename = path.basename(relativePath);
    if (!relativePath.startsWith('assets/thank-you/') || filename !== relativePath.split('/').pop()) {
      throw new Error('Invalid attachment path');
    }
    const filePath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(filePath)) throw new Error(`Attachment not found: ${filename}`);
    return { filename, path: filePath };
  });
}

function publicDeliveryError(error) {
  if (/^(Email template not found|Attachment not found|Invalid attachment path|Unknown seed email template|Email content is required)/.test(error.message)) {
    return error.message;
  }
  if (error.code === 'EAUTH') return 'Hostinger rejected the SMTP username or mailbox password';
  if (['ECONNECTION', 'ECONNREFUSED', 'ECONNRESET', 'EDNS', 'ETIMEDOUT'].includes(error.code)) {
    return 'Could not connect to the email server';
  }
  if (error.responseCode >= 500) return 'The recipient was rejected by the email server';
  return 'Email delivery failed';
}

async function saveToSentFolder(mailOptions, rawMessage) {
  const { ImapFlow } = await import('imapflow');
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || 'imap.hostinger.com',
    port: Number(process.env.IMAP_PORT || 993),
    secure: readBoolean(process.env.IMAP_SECURE, true),
    auth: {
      user: process.env.IMAP_USER || process.env.SMTP_USER || DEFAULT_MAILBOX,
      pass: process.env.IMAP_PASSWORD || process.env.SMTP_PASSWORD
    },
    logger: false
  });
  try {
    await client.connect();
    const mailboxes = await client.list();
    const sentMailbox = mailboxes.find(mailbox => /(^|[./ ])sent( items)?$/i.test(mailbox.path))
      || mailboxes.find(mailbox => /sent/i.test(mailbox.path));
    if (!sentMailbox) throw new Error('Hostinger Sent mailbox was not found');
    await client.append(sentMailbox.path, rawMessage, ['\\Seen'], new Date());
  } finally {
    await client.logout().catch(() => {});
  }
}

function sendJson(res, status, body) {
  res.status(status).json(body);
}

function inlineDataImages(html) {
  const inlineAttachments = [];
  const convertedHtml = html.replace(/data:(image\/[a-z0-9.+-]+);([^,]*?base64),([a-z0-9+/=\s]+)/gi, (match, contentType, metadata, encoded) => {
    const cid = `inline-image-${inlineAttachments.length}@christgardenmail`;
    const filenameMatch = metadata.match(/filename=([^;]+)/i);
    inlineAttachments.push({
      filename: filenameMatch ? decodeURIComponent(filenameMatch[1]) : `image-${inlineAttachments.length + 1}`,
      content: encoded.replace(/\s/g, ''),
      encoding: 'base64',
      cid,
      contentType
    });
    return `cid:${cid}`;
  });
  return { html: convertedHtml, inlineAttachments };
}

async function recordHistory(messages) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/sent_mail_history`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(messages.filter(message => message.email).map(message => ({ recipient_email: message.email, recipient_name: message.name || null })))
  });
  return response.ok;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  const { subject, messages } = req.body || {};
  if (!subject || !Array.isArray(messages) || !messages.length) {
    return sendJson(res, 400, { error: 'Subject and at least one message are required' });
  }
  if (!process.env.SMTP_PASSWORD) {
    return sendJson(res, 500, { error: 'The Hostinger mailbox password is not configured' });
  }

  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER || DEFAULT_MAILBOX;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: smtpPort,
    secure: readBoolean(process.env.SMTP_SECURE, smtpPort === 465),
    auth: { user: smtpUser, pass: process.env.SMTP_PASSWORD }
  });
  const senderAddress = process.env.SMTP_FROM || smtpUser;

  try {
    const validMessages = messages.filter(message => message.email && (message.html || message.template));
    if (!validMessages.length) return sendJson(res, 400, { error: 'No valid email messages were supplied' });
    const results = [];
    for (let index = 0; index < validMessages.length; index += 3) {
      const batchResults = await Promise.all(validMessages.slice(index, index + 3).map(async message => {
      const resolved = resolveMessageContent(message);
      const attachments = createFileAttachments(resolved.attachmentNames);
      const converted = inlineDataImages(resolved.html);
      const mailOptions = {
        from: senderAddress,
        replyTo: senderAddress,
        to: message.email,
        subject: message.subject || subject,
        html: converted.html,
        attachments: attachments.concat(converted.inlineAttachments)
      };
      const rawMessage = await nodemailer.createTransport({ streamTransport: true, buffer: true }).sendMail(mailOptions);
      const info = await transporter.sendMail(mailOptions);
      let savedToSent = false;
      try {
        await saveToSentFolder(mailOptions, rawMessage.message);
        savedToSent = true;
      } catch (sentError) {
        console.warn('Message sent but could not be copied to Hostinger Sent:', sentError.message);
      }
      return { email: message.email, messageId: info.messageId, savedToSent };
      }));
      results.push(...batchResults);
    }
    let historySaved = false;
    try {
      historySaved = await recordHistory(validMessages);
    } catch (historyError) {
      console.warn('Messages sent but history could not be recorded:', historyError.message);
    }
    return sendJson(res, 200, { sent: results.length, results, historySaved });
  } catch (error) {
    console.error('Email delivery failed:', error);
    return sendJson(res, 502, { error: publicDeliveryError(error) });
  }
};

module.exports.resolveMessageContent = resolveMessageContent;
module.exports.createFileAttachments = createFileAttachments;
