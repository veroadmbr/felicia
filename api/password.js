// Troca a senha do site ou do simulador. Só funciona com o banco (Storage) configurado.
import { kvReady } from './_kv.js';
import { checkPassword, setPassword, makeToken, cookieHeader } from './_auth.js';

const out = (data, status = 200, cookie) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...(cookie ? { 'set-cookie': cookie } : {}) },
  });

export async function POST(request) {
  if (!kvReady()) return out({ error: 'kv-not-configured' }, 503);
  let b = {};
  try { b = await request.json(); } catch (e) {}
  const area = b.area === 'sim' ? 'sim' : b.area === 'site' ? 'site' : null;
  if (!area) return out({ error: 'área inválida' }, 400);
  if (typeof b.next !== 'string' || b.next.length < 6) return out({ error: 'A senha nova precisa ter pelo menos 6 caracteres.' }, 400);
  if (!(await checkPassword(area, b.current))) return out({ error: 'Senha atual incorreta.' }, 403);
  await setPassword(area, b.next);
  return out({ ok: true }, 200, cookieHeader(area, await makeToken(area)));
}
