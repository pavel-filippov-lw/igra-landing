import './global.scss'
import './fonts/fonts.scss'

import * as Sentry from '@sentry/react'
import { FC } from 'react'

import { AppRouter } from './router'

/**
 * Last-resort fallback when a render error escapes to the app root. Uses inline
 * styles (no CSS-module dependency) so it always renders, even if the crash is
 * style-related. Sentry.ErrorBoundary reports the error before showing this.
 */
const AppErrorFallback: FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24,
      textAlign: 'center',
      background: '#0A0A0A',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    <h1 style={{ fontSize: 24, margin: 0 }}>Something went wrong</h1>
    <p style={{ margin: 0, opacity: 0.7, maxWidth: 420 }}>
      The page hit an unexpected error. Please reload — if it keeps happening, try again shortly.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      style={{
        marginTop: 8,
        padding: '12px 24px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'transparent',
        color: '#fff',
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      Reload
    </button>
  </div>
)

export const App: FC = () => (
  <Sentry.ErrorBoundary fallback={<AppErrorFallback />}>
    <AppRouter />
  </Sentry.ErrorBoundary>
)
