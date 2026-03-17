const { withSentryConfig } = require('@sentry/nextjs');

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  customWorkerSrc: 'sw-custom',
});

// Security headers
const securityHeaders = [
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // XSS Protection (legacy browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Referrer policy — don't leak full URLs
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Permissions policy — disable features we don't use
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(self), camera=(), payment=(), usb=()',
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + inline (needed for Next.js) + eval (dev only)
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sentry.io https://cdnjs.cloudflare.com https://www.youtube.com`,
      // Styles: self + inline (needed for Tailwind/styled-components)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self + external sources
      "img-src 'self' data: blob: https://*.supabase.co https://*.capivarex.com https://capivarex-production.up.railway.app https://i.scdn.co https://images.unsplash.com https://*.googleusercontent.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Connect: API + Supabase + Sentry + WebSocket
      `connect-src 'self' https://capivarex-production.up.railway.app wss://capivarex-production.up.railway.app https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://api.stripe.com`,
      // Media
      "media-src 'self' blob: https://capivarex-production.up.railway.app",
      // Frames: YouTube embeds only
      "frame-src https://www.youtube.com https://js.stripe.com",
      // Base URI
      "base-uri 'self'",
      // Form action
      "form-action 'self'",
      // Object
      "object-src 'none'",
    ].join('; '),
  },
  // HSTS — force HTTPS
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withSentryConfig(
  withPWA(nextConfig),
  {
    silent: true,
    org: 'capivarex',
    project: 'capivarex-frontend',
  },
  {
    hideSourceMaps: true,
    disableLogger: true,
  }
);
