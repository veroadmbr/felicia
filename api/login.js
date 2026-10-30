// Confere a senha (do site ou do simulador) e grava o cookie de acesso por 30 dias.
import { checkPassword, makeToken, cookieHeader } from './_auth.js';

export async function POST(request) {
  let body = {};
  try { body = await request.json(); } catch (e) {}
  const area = body.area === 'sim' ? 'sim' : 'site';
  if (!(await checkPassword(area, body.password))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json', 'set-cookie': cookieHeader(area, await makeToken(area)) },
  });
}
