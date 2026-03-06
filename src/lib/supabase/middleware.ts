import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const isMainDomain =
    hostname === 'capivarex.com' || hostname === 'www.capivarex.com';

  /* ── Main domain (capivarex.com) ── */
  if (isMainDomain) {
    // App-only routes → redirect to app subdomain
    const appOnlyPaths = ['/chat', '/services', '/insights', '/settings'];
    if (appOnlyPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(
        new URL(pathname, 'https://app.capivarex.com'),
      );
    }

    // Allow everything else on main domain (/, /landing, /pricing, /login, /register, etc.)
    return supabaseResponse;
  }

  /* ── App domain (app.capivarex.com / vercel / localhost) ── */
  const publicPaths = ['/login', '/register', '/forgot-password', '/pricing', '/landing'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  // Root page (/) handles its own redirect to /chat, let it through
  if (!user && !isPublic && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/chat';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
