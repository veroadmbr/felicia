// Protege todo o site com senha (Vercel Routing Middleware).
// A senha vem da variável de ambiente SITE_PASSWORD na Vercel.
export const config = {
  matcher: ['/((?!login\\.html|api/login|login-assets/|favicon\\.ico).*)'],
};

async function token(pass) {
  const data = new TextEncoder().encode('felicia:' + pass);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default async function middleware(request) {
  const pass = process.env.SITE_PASSWORD || 'felicia1109';
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)felicia_auth=([a-f0-9]{64})/);
  if (m && m[1] === (await token(pass))) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }
  const url = new URL(request.url);
  const login = new URL('/login.html', url);
  login.searchParams.set('next', url.pathname + url.search);
  return Response.redirect(login, 307);
}
