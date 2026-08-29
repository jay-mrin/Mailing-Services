const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

function sendJson(res, status, body) {
  res.status(status).json(body);
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
      const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: message.email,
        subject,
        html: message.html,
        attachments
      });
      results.push({ email: message.email, messageId: info.messageId });
    }
    return sendJson(res, 200, { sent: results.length, results });
  } catch (error) {
    console.error('Email delivery failed:', error);
    return sendJson(res, 502, { error: 'Email delivery failed' });
  }
};
