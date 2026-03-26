import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  // Only initialize Sentry in production or if DSN is explicitly provided
  if (!SENTRY_DSN) {
    console.log("Sentry DSN not configured, monitoring disabled");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    
    environment: import.meta.env.MODE,
    
    // Performance monitoring - sample 100% of transactions in dev, 20% in prod
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
    
    // Session replay for debugging user issues (free tier: 50 sessions/month)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Enable automatic instrumentation
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Filter out non-critical errors
    beforeSend(event) {
      // Don't send errors in development unless testing Sentry
      if (import.meta.env.DEV && !import.meta.env.VITE_SENTRY_DEBUG) {
        return null;
      }
      return event;
    },
  });
}

export { Sentry };
