const crypto = require('crypto');
const COOKIE = 'mail_session';
const MAX_AGE = 30 * 24 * 60 * 60;

function key() {
  const secret = process.env.MAIL_SESSION_SECRET || process.env.SMTP_PASSWORD;
  if (!secret) throw new Error('Mail session secret is not configured');
  return crypto.createHash('sha256').update(secret).digest();
}

function seal(credentials) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify({ ...credentials, expires: Date.now() + MAX_AGE * 1000 })), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

function readSession(req) {
  const cookie = (req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${COOKIE}=`));
  if (!cookie) return null;
  try {
    const data = Buffer.from(cookie.slice(COOKIE.length + 1), 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key(), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    const session = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString());
    return session.expires > Date.now() ? session : null;
  } catch { return null; }
}

function setSession(res, credentials) {
  res.setHeader('Set-Cookie', `${COOKIE}=${credentials ? seal(credentials) : ''}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${credentials ? MAX_AGE : 0}`);
}

module.exports = { readSession, setSession };
