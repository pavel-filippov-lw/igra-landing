/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_GIVEAWAY_API_URL?: string
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string
  /** '1' to mock the email OTP endpoints for local frontend dev. */
  readonly VITE_GIVEAWAY_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  plausible?: (event: string, options?: Record<string, unknown>) => void
}
