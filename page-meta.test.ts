import { describe, expect, it } from 'vitest'

// Explicit .ts: the repo also tracks a tsc-emitted vite.config.js, which a bare
// './vite.config' import would resolve to first.
import { PAGE_META, pageMetaFile, withPageMeta } from './vite.config.ts'

/** The head of the built root index.html that the build step rewrites per page. */
const INDEX = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Igra Labs</title>
    <meta property="og:title" content="Igra Network — EVM on Kaspa BlockDAG" />
    <meta property="og:description" content="Ethereum-compatible programmable layer on Kaspa's BlockDAG proof-of-work." />
    <meta property="og:image" content="https://igralabs.com/og-image.jpg" />
    <script type="module" crossorigin src="/assets/index-abc123.js"></script>
  </head>
  <body><div id="root"></div></body>
</html>`

const aiAgents = PAGE_META.find((p) => p.path === 'ai-agents')!

describe('page-meta build step (per-page link previews)', () => {
  it('writes the AI Agents page as ai-agents.html, not a folder index', () => {
    // A dist/ai-agents/index.html makes Netlify answer /ai-agents with a 301 to /ai-agents/.
    expect(pageMetaFile(aiAgents)).toBe('ai-agents.html')
  })

  it('gives the page its own title and share tags', () => {
    const html = withPageMeta(INDEX, aiAgents)
    expect(html).toContain('<title>AI Agents on Igra | Igra Labs</title>')
    expect(html).toContain('<meta property="og:title" content="AI Agents on Igra" />')
    expect(html).toContain('<meta property="og:image" content="https://igralabs.com/og-ai-agents.jpg" />')
    expect(html).toContain('<meta property="og:url" content="https://igralabs.com/ai-agents" />')
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
    expect(html).not.toContain('EVM on Kaspa BlockDAG')
  })

  it('keeps the same app bundle, so the page boots like the root index.html', () => {
    const html = withPageMeta(INDEX, aiAgents)
    expect(html).toContain('<script type="module" crossorigin src="/assets/index-abc123.js"></script>')
    expect(html).toContain('<body><div id="root"></div></body>')
  })

  it('fails the build when index.html lacks a tag it has to replace', () => {
    const noImage = INDEX.replace(/\n\s*<meta property="og:image"[^>]*>/, '')
    expect(() => withPageMeta(noImage, aiAgents)).toThrow(/og:image/)
  })
})
