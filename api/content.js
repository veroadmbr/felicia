// Conteúdo do site (cores, textos, imagens, slides e cenário principal).
import { kv, kvReady, json, notReady } from './_kv.js';

const KEY = 'felicia:content';
const SCEN = 'felicia:scenarios';

export async function GET() {
  if (!kvReady()) return notReady();
  const raw = await kv('GET', KEY);
  const c = raw ? JSON.parse(raw) : {};
  // O cenário principal acompanha o cenário salvo: se ele for atualizado no simulador, o site muda junto.
  if (c.scenarioId) {
    const sraw = await kv('GET', SCEN);
    const list = sraw ? JSON.parse(sraw) : [];
    const s = list.find((x) => x.id === c.scenarioId);
    if (s && s.p) {
      c.premissas = s.p;
      c.scenarioName = s.name;
    }
  }
  return json(c);
}

export async function PUT(request) {
  if (!kvReady()) return notReady();
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'json inválido' }, 400); }
  if (!body || typeof body !== 'object') return json({ error: 'conteúdo inválido' }, 400);
  body.updated = new Date().toISOString();
  await kv('SET', KEY, JSON.stringify(body));
  await kv('LPUSH', KEY + ':history', JSON.stringify(body));
  await kv('LTRIM', KEY + ':history', 0, 19);
  return json({ ok: true, updated: body.updated });
}
