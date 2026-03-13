import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://c141a47b43b9cea936110801b1c0e3ae@o4510932417576960.ingest.de.sentry.io/4511032652660816',
  tracesSampleRate: 0.2,
});
