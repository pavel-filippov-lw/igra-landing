/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface Window {
  plausible?: (event: string, options?: Record<string, unknown>) => void
}
