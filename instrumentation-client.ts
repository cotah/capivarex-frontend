import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://c141a47b43b9cea936110801b1c0e3ae@o4510932417576960.ingest.de.sentry.io/4511032652660816',
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2,
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/.*\.railway\.app\/api/,
  ],
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    /^Network Error$/,
    /^Failed to fetch$/,
  ],
});
