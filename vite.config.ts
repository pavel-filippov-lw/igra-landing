import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Pages with their own link preview. Social crawlers (X, Telegram, Slack…) don't
 * run JS, so each page gets its own copy of the built index.html with its title and
 * share tags, at dist/<path>.html (see pageMetaFile). Netlify serves a real file before
 * the SPA catch-all, and the app boots from it exactly as from the root index.html.
 * Tested in page-meta.test.ts.
 */
export interface PageMeta {
  path: string
  title: string
  ogTitle: string
  description: string
  image: string
  url: string
}

export const PAGE_META: PageMeta[] = [
  {
    path: 'ai-agents',
    title: 'AI Agents on Igra | Igra Labs',
    ogTitle: 'AI Agents on Igra',
    description:
      'Building blocks for AI agents that transact on Igra: escrowed jobs, pay-per-request payments, delegated permissions and smart accounts.',
    image: 'https://igralabs.com/og-ai-agents.jpg',
    url: 'https://igralabs.com/ai-agents',
  },
]

/**
 * Where a page's HTML goes, relative to dist/: `<path>.html`, which Netlify serves at
 * /<path>. Not `<path>/index.html`: a folder index makes Netlify 301 /<path> to /<path>/.
 */
export const pageMetaFile = (page: PageMeta) => `${page.path}.html`

/** The built index.html with the page's own title and share tags. Throws if a tag to replace is missing. */
export function withPageMeta(html: string, page: PageMeta): string {
  let out = html
  const swap = (pattern: RegExp, value: string) => {
    if (!pattern.test(out)) throw new Error(`page-meta: ${pattern} not found in index.html`)
    out = out.replace(pattern, value)
  }
  swap(/<title>[^<]*<\/title>/, `<title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta property="og:url" content="${page.url}" />
    <meta name="twitter:card" content="summary_large_image" />`)
  swap(/(<meta property="og:title" content=")[^"]*/, `$1${page.ogTitle}`)
  swap(/(<meta property="og:description" content=")[^"]*/, `$1${page.description}`)
  swap(/(<meta property="og:image" content=")[^"]*/, `$1${page.image}`)
  return out
}

function pageMeta(): Plugin {
  let outDir = 'dist'
  return {
    name: 'page-meta',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const page of PAGE_META) {
        const file = resolve(outDir, pageMetaFile(page))
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, withPageMeta(html, page))
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    pageMeta(),
    react(),
    tsconfigPaths(),
    svgr(),
    nodePolyfills({
      globals: {
        process: true,
        Buffer: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      plugins: []
    }
  },
  publicDir: './public',
  envDir: './',
  css: {
    preprocessorOptions: {
      scss:{
        additionalData: '@use "/src/shared/styles/app.scss" as *;',
      },
    },
  },
})