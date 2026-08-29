const crypto = require('crypto');
const { createSession } = require('./auth');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password, remember } = req.body || {};
  const same = (a, b) => a && b && a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  const validUser = same(username, process.env.APP_LOGIN_USERNAME);
  const validPassword = same(password, process.env.APP_LOGIN_PASSWORD);
  if (!validUser || !validPassword || !process.env.APP_SESSION_SECRET) return res.status(401).json({ error: 'Invalid username or password' });
  const maxAge = remember ? 30 * 24 * 60 * 60 : undefined;
  const cookie = [`cg_session=${createSession(Boolean(remember))}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Secure', maxAge ? `Max-Age=${maxAge}` : ''].filter(Boolean).join('; ');
  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ authenticated: true });
};
