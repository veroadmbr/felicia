// Imagens enviadas pelo CMS. Guardadas no Redis e servidas com cache longo.
import { kv, kvReady, json, notReady } from './_kv.js';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request) {
  if (!kvReady()) return notReady();
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'json inválido' }, 400); }
  const { type, b64 } = body || {};
  if (!TYPES.includes(type) || typeof b64 !== 'string') return json({ error: 'imagem inválida' }, 400);
  if (b64.length > 980000) return json({ error: 'imagem grande demais' }, 413);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  await kv('SET', 'felicia:img:' + id, JSON.stringify({ type, b64 }));
  return json({ ok: true, url: '/api/img?id=' + id });
}

export async function GET(request) {
  if (!kvReady()) return notReady();
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^[a-z0-9]+$/.test(id)) return new Response('Não encontrado', { status: 404 });
  const raw = await kv('GET', 'felicia:img:' + id);
  if (!raw) return new Response('Não encontrado', { status: 404 });
  const { type, b64 } = JSON.parse(raw);
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new Response(bin, {
    headers: { 'content-type': type, 'cache-control': 'private, max-age=31536000, immutable' },
  });
}
