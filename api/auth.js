const crypto = require('crypto');

function sign(value) {
  return crypto.createHmac('sha256', process.env.APP_SESSION_SECRET).update(value).digest('hex');
}

function createSession(remember) {
  const payload = `${Date.now()}.${remember ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 8 * 60 * 60 * 1000}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

function validSession(req) {
  const cookies = req.headers.cookie || '';
  const token = cookies.match(/(?:^|;\s*)cg_session=([^;]+)/)?.[1];
  if (!token || !process.env.APP_SESSION_SECRET) return false;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;
  const payload = Buffer.from(encoded, 'base64url').toString();
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  return Number(payload.split('.')[1]) > Date.now();
}

function requireAuth(req, res) {
  if (!validSession(req)) {
    res.status(401).json({ error: 'Authentication required' });
    return false;
  }
  return true;
}

module.exports = { createSession, requireAuth };
