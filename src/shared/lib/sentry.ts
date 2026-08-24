import * as Sentry from '@sentry/react'

/**
 * Sentry error reporting.
 *
 * No-ops without `VITE_SENTRY_DSN`, and on localhost — so local dev never spams
 * the project. Error monitoring ONLY (no performance tracing, no session replay),
 * to stay comfortably inside the free tier. `sendDefaultPii: false` — this app has
 * wallet flows, so we never attach IP/user data.
 *
 * The DSN is a public client-side key (safe to embed); it lives in an env var so
 * it can be set per Netlify context and left unset in dev.
 */

const DSN = import.meta.env.VITE_SENTRY_DSN

function currentEnvironment(): string {
  const host = window.location.hostname
  if (host === 'igralabs.com' || host === 'www.igralabs.com') return 'production'
  if (host.endsWith('.netlify.app')) return 'preview'
  return 'development'
}

export function initSentry(): void {
  if (!DSN) return
  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1' || host === '') return

  Sentry.init({
    dsn: DSN,
    environment: currentEnvironment(),
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
    // Error monitoring only — no tracing/replay (free-tier friendly).
    tracesSampleRate: 0,
    sendDefaultPii: false,
  })
}
