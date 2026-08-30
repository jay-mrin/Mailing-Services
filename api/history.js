function sendJson(res, status, body) {
  res.status(status).json(body);
}

function supabaseRequest(path, options = {}) {
  const baseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !serviceKey) throw new Error('Supabase history environment variables are not configured');
  return fetch(`${baseUrl}/rest/v1/sent_mail_history${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const response = await supabaseRequest('?select=recipient_email,recipient_name,sent_at&order=sent_at.desc&limit=1000');
      if (!response.ok) throw new Error(await response.text());
      return sendJson(res, 200, await response.json());
    }
    if (req.method === 'POST') {
      const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];
      const cleanEntries = entries.filter(item => item?.email).map(item => ({
        recipient_email: item.email,
        recipient_name: item.name || null
      }));
      if (!cleanEntries.length) return sendJson(res, 400, { error: 'No recipients supplied' });
      const response = await supabaseRequest('', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(cleanEntries) });
      if (!response.ok) throw new Error(await response.text());
      return sendJson(res, 201, { saved: cleanEntries.length });
    }
    return sendJson(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('History request failed:', error);
    return sendJson(res, 500, { error: 'History is unavailable' });
  }
};
