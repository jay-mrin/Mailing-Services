module.exports = function handler(req, res) {
  res.setHeader('Set-Cookie', 'cg_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0');
  res.status(200).json({ authenticated: false });
};
