const { withSentryConfig } = require('@sentry/nextjs');

// Unique build ID — changes on every deploy, forcing SW cache invalidation.
// This is the definitive fix for the "images only appear after Ctrl+Shift+R" bug.
const BUILD_ID = Date.now().toString();

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,          // New SW activates immediately on next page load
  reloadOnOnline: true,       // Force reload when back online to get fresh assets
  customWorkerSrc: 'sw-custom',
  // Prevent stale image bug — external CDN images always fetched fresh
  aggressiveFrontEndNavCaching: false,
  workboxOptions: {
    // Unique cache name per build — old caches are abandoned automatically
    cacheId: `capivarex-${BUILD_ID}`,
    // Clean up all caches from previous builds on activation
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      {
        // CloudFront CDN images: NetworkFirst — always try network first,
        // fall back to cache only if offline (timeout 4s)
        urlPattern: /^https:\/\/[^/]*\.cloudfront\.net\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: `cdn-images-${BUILD_ID}`,
          expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
          networkTimeoutSeconds: 4,
        },
      },
      {
        // All other images (supabase, unsplash, etc): NetworkFirst as well
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: `images-${BUILD_ID}`,
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
          networkTimeoutSeconds: 4,
        },
      },
    ],
  },
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
      "img-src 'self' data: blob: https://*.supabase.co https://*.capivarex.com https://capivarex-production.up.railway.app https://i.scdn.co https://images.unsplash.com https://*.googleusercontent.com https://*.cloudfront.net https://upload.wikimedia.org",
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
  // Performance: remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Performance: optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-hot-toast'],
  },
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
