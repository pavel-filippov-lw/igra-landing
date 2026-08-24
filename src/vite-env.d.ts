/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_GIVEAWAY_API_URL?: string
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string
  /** '1' to mock the email OTP endpoints for local frontend dev. */
  readonly VITE_GIVEAWAY_MOCK?: string
  /** PoolStakes network profile: 'mainnet' (default) | 'galleon' | 'fork'. */
  readonly VITE_POOLSTAKES_NETWORK?: string
  /** Sentry DSN (public key). Error reporting is off when unset. */
  readonly VITE_SENTRY_DSN?: string
  /** Optional Sentry release identifier (e.g. commit SHA). */
  readonly VITE_SENTRY_RELEASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  plausible?: (event: string, options?: Record<string, unknown>) => void
}
