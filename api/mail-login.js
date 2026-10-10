const nodemailer = require('nodemailer');
const { readSession, setSession } = require('../lib/mail-session');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const session = readSession(req);
    return res.status(200).json({ email: session?.email || '', loggedIn: Boolean(session) });
  }
  if (!['POST', 'DELETE'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Request not allowed' });
  if (req.method === 'DELETE') {
    setSession(res, null);
    return res.status(200).json({ loggedIn: false });
  }
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return res.status(415).json({ error: 'JSON is required' });
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof password !== 'string' || !password || password.length > 512) {
    return res.status(400).json({ error: 'Enter a valid email address and password.' });
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: !/^(false|0|no|off)$/i.test(process.env.SMTP_SECURE || 'true'),
    auth: { user: email, pass: password },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000
  });
  try {
    await transport.verify();
    setSession(res, { email, password });
    return res.status(200).json({ email, loggedIn: true });
  } catch (error) {
    return res.status(error.code === 'EAUTH' ? 401 : 502).json({ error: error.code === 'EAUTH' ? 'Hostinger rejected this email or password. Please try again.' : 'Could not save the login. Please check the mail server configuration and try again.' });
  } finally { transport.close(); }
};
