// Cenários salvos no simulador, compartilhados entre todos os computadores.
import { kv, kvReady, json, notReady } from './_kv.js';

const KEY = 'felicia:scenarios';

export async function GET() {
  if (!kvReady()) return notReady();
  const raw = await kv('GET', KEY);
  return json(raw ? JSON.parse(raw) : []);
}

export async function PUT(request) {
  if (!kvReady()) return notReady();
  let list;
  try { list = await request.json(); } catch (e) { return json({ error: 'json inválido' }, 400); }
  if (!Array.isArray(list)) return json({ error: 'lista inválida' }, 400);
  await kv('SET', KEY, JSON.stringify(list));
  return json({ ok: true, count: list.length });
}
