// Acesso ao Upstash Redis (Vercel Storage) pela API REST, sem dependências.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvReady = () => Boolean(URL_ && TOKEN);

export async function kv(...cmd) {
  if (!kvReady()) throw new Error('kv-not-configured');
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || 'kv-error ' + r.status);
  return j.result;
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const notReady = () =>
  json({ error: 'kv-not-configured', message: 'Conecte um banco Upstash Redis ao projeto na Vercel (Storage).' }, 503);
