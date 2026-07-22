import thumbKaspaRealTimeMoney from './assets/yt-LltPKCaIUbQ.jpg'
import thumbCovenantRoad from './assets/yt-sVde1lhecn0.jpg'
import thumbBusinessEra from './assets/yt-iUoHNk5rqaA.jpg'
import thumbIgraFinanceInfra from './assets/yt-kRYaEKI0GoU.jpg'
import thumbBerlinBlockchainWeek from './assets/yt-0MKeiYAoVQ0.jpg'
import thumbWeb3SamKamani from './assets/web3pod-show.jpg'
import thumbXximKaspaEcosystem from './assets/yt-xVawtkv26uc.jpg'
import thumbKaspa2Recap from './assets/yt-p6NIIcvzE2k.jpg'
import thumbRunFullNode from './assets/yt-cVcgpl0A7Pw.jpg'
import thumbBscnAshton from './assets/yt-l6SaBU-4EZc.jpg'
import thumbEthDamMinRollup from './assets/yt-M3xHqk-4dYA.jpg'
import thumbKaspaExpProgrammability from './assets/yt-8QgpOIHIx1M.jpg'
import thumbAtanDecentralizedL2 from './assets/yt-9zQWAMuQREU.jpg'
import thumbKaspaL2Composability from './assets/yt-NH9u1ifpsIg.jpg'
import thumbKaspaL2BasedRollups from './assets/yt-CUfomKOmCMQ.jpg'

export type MediaCategory = 'Video' | 'Podcast' | 'Talk' | 'Tutorial'

export interface MediaItem {
  image: string
  title: string
  description: string
  category: MediaCategory
  year: number
  link: string
  imagePosition?: string
}

export const mediaItems: MediaItem[] = [
  {
    image: thumbXximKaspaEcosystem,
    title: 'Kaspa Ecosystem is just getting started: Toccata / ZK Based Rollup & Igra Ecosystem!',
    description: 'XXIM · 4 July 2026',
    category: 'Podcast',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=xVawtkv26uc',
  },
  {
    image: thumbWeb3SamKamani,
    title: '406: Igra Labs Is Making DeFi Front-Run Resistant and Agent-Ready',
    description: 'Web3 with Sam Kamani · 20 June 2026',
    category: 'Podcast',
    year: 2026,
    link: 'https://open.spotify.com/episode/0lNzHkJZrqGqX0N64GNIpy',
  },
  {
    image: thumbKaspaRealTimeMoney,
    title: 'Kaspa: Real-Time Money, Decades in the Making',
    description: 'Kaspa × Igra · Berlin Blockchain Week · 19 June 2026',
    category: 'Talk',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=LltPKCaIUbQ',
  },
  {
    image: thumbCovenantRoad,
    title: 'Kaspa Toccata: A Path Down Covenant Road',
    description: 'Kaspa × Igra · Berlin Blockchain Week · 19 June 2026',
    category: 'Talk',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=sVde1lhecn0',
  },
  {
    image: thumbBusinessEra,
    title: 'Entering the Business Era on Kaspa',
    description: 'Kaspa × Igra · Berlin Blockchain Week · 19 June 2026',
    category: 'Talk',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=iUoHNk5rqaA',
  },
  {
    image: thumbIgraFinanceInfra,
    title: 'Igra Network: Finance Infrastructure That Cannot Be Overridden',
    description: 'Kaspa × Igra · Berlin Blockchain Week · 19 June 2026',
    category: 'Talk',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=kRYaEKI0GoU',
  },
  {
    image: thumbBerlinBlockchainWeek,
    title: 'Kaspa × Igra day at Berlin Blockchain Week · 19 June 2026',
    description: 'Kaspa × Igra · Berlin Blockchain Week · 19 June 2026',
    category: 'Video',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=0MKeiYAoVQ0',
  },
  {
    image: thumbBscnAshton,
    title: 'Exclusive: 30 Minutes with Ashton (Igra Labs, Moonbound)',
    description: 'BSCN · 11 May 2026',
    category: 'Podcast',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=l6SaBU-4EZc',
  },
  {
    image: thumbRunFullNode,
    title: 'Igra Mainnet — How to Run a Full Node',
    description: 'Argon Mining · 5 March 2026',
    category: 'Tutorial',
    year: 2026,
    link: 'https://www.youtube.com/watch?v=cVcgpl0A7Pw',
  },
  {
    image: thumbAtanDecentralizedL2,
    title: 'Igra Labs: ATAN Makes Decentralized L2s on Kaspa Possible',
    description: 'XXIM · 27 December 2025',
    category: 'Podcast',
    year: 2025,
    link: 'https://www.youtube.com/watch?v=9zQWAMuQREU',
  },
  {
    image: thumbKaspaExpProgrammability,
    title: 'Programmability on Kaspa — Pavel Emdin (Igra Labs) · The Kaspa Experience 2025',
    description: 'The Kaspa Experience · 27 September 2025',
    category: 'Talk',
    year: 2025,
    link: 'https://www.youtube.com/watch?v=8QgpOIHIx1M',
  },
  {
    image: thumbKaspaL2Composability,
    title: 'Kaspa L2: Atomic Composability + Igra Labs Upcoming Testnet',
    description: 'XXIM · 30 June 2025',
    category: 'Podcast',
    year: 2025,
    link: 'https://www.youtube.com/watch?v=NH9u1ifpsIg',
  },
  {
    image: thumbEthDamMinRollup,
    title: 'The Minimum Rollup Constraint Theory — Pavel Emdin · ETHDam III 2025',
    description: 'Igra Labs · 25 May 2025',
    category: 'Talk',
    year: 2025,
    link: 'https://www.youtube.com/watch?v=M3xHqk-4dYA',
  },
  {
    image: thumbKaspa2Recap,
    title: 'Kaspa 2.0 Recap: Igra — Based Rollup for Limitless DeFi, by Maya Zehavi',
    description: 'Kaspa Ecosystem Foundation · 19 April 2025',
    category: 'Talk',
    year: 2025,
    link: 'https://www.youtube.com/watch?v=p6NIIcvzE2k',
  },
  {
    image: thumbKaspaL2BasedRollups,
    title: 'Kaspa L2 by Igra Labs — Based Rollups, KIP15 and Stablecoins',
    description: 'XXIM · 19 April 2025',
    category: 'Podcast',
    year: 2025,
    link: 'https://www.youtube.com/watch?v=CUfomKOmCMQ',
  },
]
