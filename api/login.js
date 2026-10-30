// Confere a senha e grava o cookie de acesso por 30 dias.
async function token(pass) {
  const data = new TextEncoder().encode('felicia:' + pass);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request) {
  const pass = process.env.SITE_PASSWORD || 'felicia1109';
  let body = {};
  try { body = await request.json(); } catch (e) {}
  if (!body.password || body.password !== pass) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const t = await token(pass);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'content-type': 'application/json',
      'set-cookie': `felicia_auth=${t}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
    },
  });
}
