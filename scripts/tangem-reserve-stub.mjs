#!/usr/bin/env node
/**
 * Local stub of the giveaway API for the Tangem FINAL RESERVE WINDOW flow
 * (FRONTEND-BRIEF-final-reserve-window.md §7). Dev/test only — no signature
 * checks, no persistence. Use until the real endpoints land.
 *
 *   node scripts/tangem-reserve-stub.mjs
 *   VITE_GIVEAWAY_API_URL=http://localhost:8787 VITE_GIVEAWAY_MOCK=1 yarn dev --port 5174
 *
 * Scenarios via env:
 *   WINDOW = scheduled | open | closed | finalized | none      (default: open; none → 404)
 *   STATUS = reserve | reserve-submitted | reserve-notselected | winner | expired | claimed
 *            | round3 | notindraw                               (default: reserve)
 *   PORT   = 8787
 */
import { createServer } from 'node:http'

const PORT = Number(process.env.PORT || 8787)
const WINDOW = process.env.WINDOW || 'open'
const STATUS = process.env.STATUS || 'reserve'

const OPENS = '2026-09-23T18:00:00.000Z'
const CLOSES = '2026-10-07T18:00:00.000Z'
const now = () => new Date().toISOString()
const windowRow = () => ({ state: WINDOW, opensAt: OPENS, closesAt: CLOSES, serverTime: now() })

const addr = (i) => `0x${(i * 2654435761 >>> 0).toString(16).padStart(8, '0')}${'ab'.repeat(16)}`
const winners = Array.from({ length: 18 }, (_, i) => {
  const rank = i + 1
  const round = rank <= 10 ? 1 : 2
  const status = [1, 10, 12, 13, 17].includes(rank) ? 'claimed' : rank <= 10 ? 'expired' : 'active'
  return { rank, address: addr(rank), round, status }
})

function winnerStatus() {
  const base = { serverTime: now() }
  switch (STATUS) {
    case 'winner':
      return { selected: true, rank: 11, round: 2, claimStatus: 'unclaimed', claimDeadlineAt: CLOSES, nonce: 'stub-nonce', ...base }
    case 'expired':
      return { selected: true, rank: 2, round: 1, claimStatus: 'expired', claimDeadlineAt: '2026-09-07T18:00:00.000Z', ...base }
    case 'claimed':
      return { selected: true, rank: 1, round: 1, claimStatus: 'claimed', claimRef: 'TZG-0001', claimedAt: '2026-08-26T10:02:21.000Z', ...base }
    case 'round3':
      return { selected: true, rank: 57, round: 3, claimStatus: 'claimed', claimRef: 'TZG-0057', claimedAt: '2026-10-08T09:00:00.000Z', ...base }
    case 'notindraw':
      return { selected: false, inDraw: false }
    default:
      return { selected: false, inDraw: true }
  }
}

function reserveStatus() {
  const submitted = STATUS === 'reserve-submitted' || STATUS === 'reserve-notselected'
  return {
    inDraw: true,
    rank: 57,
    window: windowRow(),
    submission: submitted
      ? { reference: 'RSV-0057', submittedAt: '2026-09-24T09:10:00.000Z', updatedAt: '2026-09-24T09:10:00.000Z' }
      : null,
    outcome: WINDOW === 'finalized' ? (STATUS === 'reserve-notselected' ? 'not_selected' : null) : null,
    ...(WINDOW === 'open' ? { nonce: 'stub-nonce' } : {}),
    registeredEmail: 't***@gmail.com',
  }
}

const routes = {
  // Lets a test harness confirm it is talking to the stub instance it started.
  'GET /__scenario': () => [200, { WINDOW, STATUS, pid: process.pid }],
  'GET /reserve-window': () => (WINDOW === 'none' ? [404, { error: 'no window' }] : [200, { ...windowRow(), prizesRemaining: 5 }]),
  'GET /winners': () => [200, winners],
  'POST /winner-status': () => [200, winnerStatus()],
  'POST /reserve-status': () => [200, reserveStatus()],
  'POST /eligibility': () => [200, { eligible: true, nonce: 'stub-nonce' }],
  'POST /verify': () => [200, { claimToken: 'stub-token' }],
  'POST /email/start': () => [200, { ok: true }],
  'POST /email/confirm': () => [200, { ok: true }],
  'POST /claim': () => [200, { claimRef: 'TZG-0011', claimedAt: now() }],
  'POST /reserve-submit': () => [200, { ok: true, reference: 'RSV-0057', submittedAt: now(), updatedAt: now() }],
}

createServer((req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors)
    return res.end()
  }
  const path = new URL(req.url, 'http://x').pathname.replace(/^\/giveaway/, '')
  const key = Object.keys(routes).find((k) => k === `${req.method} ${path}`)
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    const [code, json] = key ? routes[key]() : [404, { error: `no stub for ${req.method} ${path}` }]
    console.log(`${req.method} ${path} → ${code}`)
    res.writeHead(code, { ...cors, 'Content-Type': 'application/json' })
    res.end(JSON.stringify(json))
  })
}).listen(PORT, () => {
  console.log(`tangem reserve stub on http://localhost:${PORT}  WINDOW=${WINDOW} STATUS=${STATUS}`)
})
