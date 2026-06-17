import news16Image from './assets/news16.jpg'
import news17Image from './assets/news17.png'
import news2Image from './assets/news2.jpg'
import news3Image from './assets/news3.png'
import news4Image from './assets/news4.png'
import news5Image from './assets/news5.jpg'
import news6Image from './assets/news6.jpg'
import news7Image from './assets/news7.png'
import news8Image from './assets/news8.jpg'
import news9Image from './assets/news9.png'
import news10Image from './assets/news10.jpg'
import news11Image from './assets/news11.png'
import news12Image from './assets/news12.jpg'
import news13Image from './assets/news13.jpg'
import news14Image from './assets/news14.jpg'
import news15Image from './assets/news15.png'

export interface NewsItem {
  image: string
  tag: string
  title: string
  description: string
  link: string
  imagePosition?: string
  imageFit?: 'contain' | 'cover'
}

export const newsItems: NewsItem[] = [
  {
    image: news16Image,
    tag: "Event",
    title: "Registration open for Kaspa x Igra Berlin Blockchain Week event",
    description: "Join us at Berlin Blockchain Week for the Kaspa x Igra event. Register now to secure your spot.",
    link: "https://luma.com/q8zh39zs",
  },
  {
    image: news17Image,
    tag: "Article",
    title: "Attester restaking enabled",
    description: "Attesters now can compound rewards into stake without giving up emission share.",
    link: "https://x.com/Igra_Labs/status/2067232269723431177",
  },
  {
    image: news15Image,
    tag: "Article",
    title: "DeFi ecosystem with $4.5M in liquidity deployed on Igra",
    description: "Within eight weeks of open mainnet, a working DeFi ecosystem with $4.5M in liquidity deployed on Igra. We optimize so builders ship faster by working directly with core and ecosystem teams.",
    link: "https://x.com/Igra_Labs/status/2059354269178900826",
    imagePosition: 'center',
  },
  {
    image: news13Image,
    tag: "Article",
    title: "Toccata: what Kaspa's next consensus upgrade means for Igra",
    description: "Toccata, Kaspa's next consensus upgrade, is currently targeted for mid to late June. Here's what it means for the ecosystem and for Igra.",
    link: "https://x.com/Igra_Labs/status/2055770156765188355",
  },
  {
    image: news14Image,
    tag: "Article",
    title: "Igra partners with ChainPatrol to protect the community",
    description: "Your safety is our priority. We've partnered with ChainPatrol to protect the Igra community.",
    link: "https://x.com/Igra_Labs/status/2057374153829659099",
  },
  {
    image: news11Image,
    tag: "Article",
    title: "MEV resilience study is published",
    description: "One of Igra's defining properties is MEV resilience. We just published a documentation page on the mechanism, aimed at integrators and partners.",
    link: "https://x.com/Igra_Labs/status/2049102131861377438",
  },
  {
    image: news12Image,
    tag: "Article",
    title: "New Hyperlane warp routes on Igra",
    description: "Igra now has bridge routes to 9 blue-chip assets including USDC, USDT, USDS, sUSDS, cbBTC, wstETH, WETH, SOL, and iKAS across Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche, and Solana.",
    link: "https://x.com/Igra_Labs/status/2048809693087400082",
  },
  {
    image: news9Image,
    tag: "Article",
    title: "Attester client v2.3.2 released",
    description: "Main features: delegated attestation and stability improvements.",
    link: "https://x.com/Igra_Labs/status/2046514932250730944",
  },
  {
    image: news10Image,
    tag: "Article",
    title: "AI agents need wallets that don't require human co-signing on every tx",
    description: "That infra is now live on Igra.",
    link: "https://x.com/Igra_Labs/status/2044345525076373930",
  },
  {
    image: news8Image,
    tag: "Article",
    title: "Hyperlane warp routes are live on Igra Network",
    description: "Anyone can now bridge USDC, iKAS, cbBTC, and wstETH across 7 chains — Ethereum, Base, Arbitrum, Optimism, Polygon, Avalanche, and Igra.",
    link: "https://x.com/Igra_Labs/status/2042327945792868420",
  },
  {
    image: news7Image,
    tag: "Article",
    title: "$IGRA public sale is concluded",
    description: "Thanks to everyone who showed up to support the unstoppable digital economy on Kaspa BlockDAG!",
    link: "https://x.com/Igra_Labs/status/2040087520260534406",
  },
  {
    image: news6Image,
    tag: "Article",
    title: "On March 26th ZAP launch on Igra Mainnet",
    description: "On March 26 2026 the first public protocol goes live on Igra Mainnet.\n\nZealousSwap opens a seven-day continuous auction for up to 500 million $IGRA.",
    link: "https://x.com/Igra_Labs/status/2032227373412753715",
  },
  {
    image: news5Image,
    tag: "Article",
    title: "Igra Mainnet Genesis block mined",
    description: "Igra Mainnet Genesis block mined at DAA score 366020000: https://explorer.igralabs.com/block/0\n\nIgra Mainnet transactions prefix: 97b1.\n\nCore contracts deployed.",
    link: "https://x.com/Igra_Labs/status/2026747528755216889",
  },
  {
    image: news4Image,
    tag: "Article",
    title: "The next million on-chain users won't be human",
    description: "A [not so] quiet revolution is happening. The ERC-8004 standard for autonomous agent reputation and discovery went live on Ethereum mainnet January 29...",
    link: "https://x.com/Igra_Labs/status/2021691714348458366",
  },
  {
    image: news3Image,
    tag: "Article",
    title: "AI Agents are welcome to Igra Network",
    description: "We published a skill so AI agents can interact with Igra directly.\nDear agents, please follow these instructions: https://igralabs.com/skills/igra-network/galleon-test-mainnet.md",
    link: "https://x.com/Igra_Labs/status/2020843930099556791",
  },
  {
    image: news2Image,
    tag: "Article",
    title: "On what matters most",
    description: "2025 is fading into the sunset.\nWe could reflect on many things as we built something beautiful this year. The precision mechanics of Viaduct and ATAN, a major refactoring of an Ethereum execution...",
    link: "https://x.com/Igra_Labs/status/2006331167855767618",
  },
]
