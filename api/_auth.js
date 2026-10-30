// Senhas e sessões. As senhas ficam no banco (hash com sal); sem banco, valem as senhas padrão.
import { kv, kvReady } from './_kv.js';

export const DEFAULTS = {
  site: process.env.SITE_PASSWORD || 'felicia1109',
  sim: process.env.SIM_PASSWORD || 'simulador201109327',
};
export const COOKIE = { site: 'felicia_auth', sim: 'felicia_sim' };

const enc = new TextEncoder();
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const secret = () =>
  process.env.SESSION_SECRET || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || 'felicia-local';

export async function sha(s) {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
}
async function hmac(msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}
export async function epoch(area) {
  if (!kvReady()) return 0;
  try { return Number(await kv('GET', 'felicia:epoch:' + area)) || 0; } catch (e) { return 0; }
}
export async function makeToken(area) {
  const e = await epoch(area);
  return `${area}.${e}.${await hmac(area + '.' + e)}`;
}
export async function validToken(token, area, checkEpoch) {
  if (!token) return false;
  const [a, e, sig] = token.split('.');
  if (a !== area || !sig) return false;
  if (sig !== (await hmac(a + '.' + e))) return false;
  if (checkEpoch && Number(e) !== (await epoch(area))) return false;
  return true;
}
export async function checkPassword(area, pw) {
  if (typeof pw !== 'string') return false;
  if (kvReady()) {
    try {
      const h = await kv('GET', 'felicia:pw:' + area);
      if (h) { const [salt, hash] = h.split(':'); return (await sha(salt + pw)) === hash; }
    } catch (e) {}
  }
  return pw === DEFAULTS[area];
}
export async function setPassword(area, pw) {
  const salt = crypto.randomUUID();
  await kv('SET', 'felicia:pw:' + area, salt + ':' + (await sha(salt + pw)));
  await kv('INCR', 'felicia:epoch:' + area);
}
export const cookieHeader = (area, token) =>
  `${COOKIE[area]}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`;
export function readCookie(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}
