// Protege o site com duas senhas: a do site (landing) e a do simulador (simulador, CMS e gravações).
import { COOKIE, readCookie, validToken } from './api/_auth.js';

export const config = {
  matcher: ['/((?!login\\.html|api/login|login-assets/|favicon\\.ico).*)'],
};

const next = () => new Response(null, { headers: { 'x-middleware-next': '1' } });

export default async function middleware(request) {
  const url = new URL(request.url);
  const p = url.pathname;
  const isApi = p.startsWith('/api/');
  const isDoc = request.headers.get('sec-fetch-dest') === 'document' || (request.headers.get('accept') || '').includes('text/html');

  const toLogin = (area) => {
    if (isApi) return new Response(JSON.stringify({ error: 'login', area }), { status: 401, headers: { 'content-type': 'application/json' } });
    const l = new URL('/login.html', url);
    l.searchParams.set('next', p + url.search);
    if (area === 'sim') l.searchParams.set('area', 'sim');
    return Response.redirect(l, 307);
  };

  if (!(await validToken(readCookie(request, COOKIE.site), 'site', isDoc))) return toLogin('site');

  const restricted =
    p.startsWith('/simulador') || p.startsWith('/cms') ||
    p === '/api/password' || p === '/api/scenarios' ||
    (isApi && request.method !== 'GET' && request.method !== 'HEAD');
  if (restricted && !(await validToken(readCookie(request, COOKIE.sim), 'sim', isDoc || isApi))) return toLogin('sim');

  return next();
}
