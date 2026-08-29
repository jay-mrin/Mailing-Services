const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { requireAuth } = require('./auth');

async function saveToSentFolder(mailOptions, rawMessage) {
  const { ImapFlow } = await import('imapflow');
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || 'imap.hostinger.com',
    port: Number(process.env.IMAP_PORT || 993),
    secure: true,
    auth: {
      user: process.env.IMAP_USER || process.env.SMTP_USER,
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
  if (!requireAuth(req, res)) return;

  const { subject, messages } = req.body || {};
  if (!subject || !Array.isArray(messages) || !messages.length) {
    return sendJson(res, 400, { error: 'Subject and at least one message are required' });
  }
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return sendJson(res, 500, { error: 'SMTP environment variables are not configured' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
  });

  try {
    const results = [];
    for (const message of messages) {
      if (!message.email || !message.html) continue;
      const attachmentNames = Array.isArray(message.attachments)
        ? message.attachments
        : message.attachments ? [message.attachments] : [];
      const attachments = attachmentNames.map(relativePath => {
        const filename = path.basename(relativePath);
        if (!relativePath.startsWith('assets/thank-you/') || filename !== relativePath.split('/').pop()) {
          throw new Error('Invalid attachment path');
        }
        const filePath = path.join(process.cwd(), relativePath);
        if (!fs.existsSync(filePath)) throw new Error(`Attachment not found: ${filename}`);
        return { filename, path: filePath };
      });
      const converted = inlineDataImages(message.html);
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: message.email,
        subject,
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
      results.push({ email: message.email, messageId: info.messageId, savedToSent });
    }
    let historySaved = false;
    try {
      historySaved = await recordHistory(messages);
    } catch (historyError) {
      console.warn('Messages sent but history could not be recorded:', historyError.message);
    }
    return sendJson(res, 200, { sent: results.length, results, historySaved });
  } catch (error) {
    console.error('Email delivery failed:', error);
    return sendJson(res, 502, { error: 'Email delivery failed' });
  }
};
