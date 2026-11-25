import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { PublicAuctionPage } from './PublicAuctionPage'

// The page chrome (header, footer, background) reads browser globals such as
// `navigator` while rendering; the auction content under test doesn't need it.
vi.mock('~/Components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/Components')>()),
  PageLayout: ({ children }: { children?: ReactNode }) => children,
}))

/** Server-render the auction page at `path`, routed as in AppRouter. */
const render = (path: string) =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/public-auction/:section?" element={<PublicAuctionPage />} />
      </Routes>
    </MemoryRouter>,
  )

/** Visible text: tags dropped, entities and non-breaking spaces normalised. */
const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;| /g, ' ')
    .replace(/\s+/g, ' ')

const CLAIM_URL = 'https://auctions.zealousswap.com/auctions/igra'

describe('Public auction page after the auction', () => {
  // The URL stays, so old links in posts and chats still land on this tab.
  describe('the former "How to Participate" tab', () => {
    let html = ''
    let text = ''
    // The tab's own content, without the sidebar and mobile menu (which link to every tab).
    let main = ''
    beforeAll(() => {
      html = render('/public-auction/how-to-participate')
      text = textOf(html)
      main = html.slice(html.indexOf('<main'), html.indexOf('</main>'))
    })

    it('shows the auction-ended notice with the claim link', () => {
      expect(text).toContain('The IGRA public auction has ended')
      expect(text).toContain('The auction ran from 26 March to 3 April 2026.')
      expect(text).toContain('you can still claim your IGRA and any iKAS refund')
      expect(main).toContain(`href="${CLAIM_URL}"`)
    })

    it('links to the Facts and Support tabs', () => {
      expect(main).toContain('href="/public-auction/facts"')
      expect(main).toContain('href="/public-auction/support"')
    })

    it('is labelled "Claim (auction ended)"', () => {
      expect(text).toContain('Claim (auction ended)')
      expect(text).not.toContain('How to Participate')
    })

    it('names no exchange, on-ramp or bridge to buy or fund KAS', () => {
      expect(html).not.toMatch(/guardarian|kraken|zelcore|topper|coingecko|katbridge|kurncy/i)
      expect(text).not.toMatch(/recommended|buy kas|bridge kas/i)
    })

    it('has no "you\'re here" marker', () => {
      expect(text).not.toMatch(/you're here/i)
    })
  })

  it('gives the auction dates from the contract in Overview: March 26 to April 3', () => {
    const text = textOf(render('/public-auction/overview'))
    expect(text).toContain('ran March 26 — April 3, 2026')
    expect(text).not.toContain('March 28')
  })
})
