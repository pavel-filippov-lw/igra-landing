/**
 * Some in-app browsers expose no IndexedDB at all (seen: X/Twitter's browser on
 * iOS, Sentry IGRA-LANDING-J). WalletConnect's storage then never finishes
 * starting up, and tapping a wallet in the AppKit modal silently does nothing.
 *
 * Run this before loading a wallet page: when IndexedDB is missing it installs an
 * in-memory one (`fake-indexeddb`, defined the same way as its `auto` entry).
 * Normal browsers never download it. Data stored there is lost on reload, which
 * the claim flows don't rely on.
 */
export async function ensureIndexedDB(): Promise<void> {
  if (typeof globalThis.indexedDB !== 'undefined') return
  try {
    const idb = await import('fake-indexeddb')
    for (const [name, value] of Object.entries(idb)) {
      if (name === 'indexedDB' || name.startsWith('IDB')) {
        Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
      }
    }
  } catch {
    // The polyfill failed to load: render the page anyway; only connecting is affected.
  }
}
