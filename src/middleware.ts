import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * PERFORMANCE: Only run middleware on authenticated routes.
     * Skip: landing, pricing, login, register, forgot-password, api, static assets.
     * This reduces TTFB for public pages by ~200-500ms.
     */
    '/((?!landing|pricing|login|register|forgot-password|api|_next/static|_next/image|favicon|icons|logo|manifest|og-|sw|workbox|.*\\..*).*)',
  ],
};
