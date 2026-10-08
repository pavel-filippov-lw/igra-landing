// The BROWSER build of AppKit's WalletConnect storage (what the site ships); the
// package's default entry in Node is a server build that never touches indexedDB.
// eslint-disable-next-line import-x/no-extraneous-dependencies -- transitive via @reown/appkit
// @ts-expect-error -- the browser build has no .d.ts of its own
import { KeyValueStorage } from '@walletconnect/keyvaluestorage/dist/index.es.js'
import { afterEach, describe, expect, it } from 'vitest'

import { ensureIndexedDB } from './ensureIndexedDB'

/**
 * Sentry IGRA-LANDING-J: X's in-app browser on iOS has no `indexedDB`. Without it
 * WalletConnect's storage never finishes starting up, so tapping a wallet does
 * nothing. Node has no `indexedDB` either, which makes it a faithful stand-in.
 */

const scope = globalThis as { indexedDB?: unknown }

afterEach(() => {
  delete scope.indexedDB
})

const roundTrip = () =>
  new Promise<unknown>((resolve, reject) => {
    const open = indexedDB.open('ensure-indexeddb-test')
    open.onupgradeneeded = () => open.result.createObjectStore('kv')
    open.onerror = () => reject(open.error)
    open.onsuccess = () => {
      const db = open.result
      const write = db.transaction('kv', 'readwrite')
      write.objectStore('kv').put('stored', 'key')
      write.oncomplete = () => {
        const read = db.transaction('kv').objectStore('kv').get('key')
        read.onsuccess = () => resolve(read.result)
        read.onerror = () => reject(read.error)
      }
    }
  })

describe('ensureIndexedDB', () => {
  it('leaves a browser-provided indexedDB untouched', async () => {
    const native = { open: () => null }
    scope.indexedDB = native
    await ensureIndexedDB()
    expect(scope.indexedDB).toBe(native)
  })

  it('installs a working in-memory indexedDB when the browser has none', async () => {
    expect(typeof scope.indexedDB).toBe('undefined')
    await ensureIndexedDB()
    expect(await roundTrip()).toBe('stored')
  })

  it("lets WalletConnect's storage start up in a browser without indexedDB", async () => {
    await ensureIndexedDB()
    const storage = new KeyValueStorage()
    await storage.setItem('wc@2:test', { ok: true })
    expect(await storage.getItem('wc@2:test')).toEqual({ ok: true })
  })
})
