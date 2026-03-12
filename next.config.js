const { withSentryConfig } = require('@sentry/nextjs');

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  customWorkerSrc: 'sw-custom',
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

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
