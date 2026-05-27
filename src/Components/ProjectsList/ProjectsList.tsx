import { FC, Fragment } from "react"

import { Flex } from "~/shared/ui"

import aporia from './assets/aporia.png'
import crestdev from './assets/crestdev.png'
import dagscan from './assets/dagscan.png'
import fervent from './assets/fervent.png'
import gscompliance from './assets/gscompliance.jpg'
import hyperlane from './assets/hyperlane.png'
import kaskad from './assets/kaskad.png'
import kaspacom from './assets/kaspacom.png'
import kaspafinance from './assets/kaspafinance.png'
import kasperia from './assets/kasperia.png'
import kaspulse from './assets/kaspulse.png'
import kastle from './assets/kastle.png'
import kasware from './assets/kasware.png'
import katbridge from './assets/katbridge.png'
import knexous from './assets/knexous.png'
import kyo from './assets/kyo.png'
import moonbound from './assets/moonbound.png'
import nacho from './assets/nacho.png'
import quex from './assets/quex.png'
import spectre from './assets/spectre.jpg'
import tangem from './assets/tangem.png'
import tbdai from './assets/tbdai.png'
import zealous from './assets/zealous.png'
import zelcore from './assets/zelcore.png'
import { Card, Project } from "./Card"

const projects: Project[] = [

  {
    logoUrl: zealous,
    name: 'Zealous Swap',
    description: 'Zealous Swap - Kaspa\'s first AMM DEX with NFT-based fees, protocol-owned liquidity, insurance fund, and modular fees.',
    to: 'https://www.zealousswap.com/',
    type: 'DeFi, DEX',
    badge: 'mainnet',
  },

  {
    logoUrl: kaskad,
    name: 'Kaskad',
    description: 'Fully decentralized lending protocol, tailored for Kaspa\'s high-speed architecture.',
    to: 'https://kaskad.app/',
    type: 'DeFi, Lending protocol',
    badge: 'mainnet',
  },

  {
    logoUrl: hyperlane,
    name: 'Hyperlane',
    description: 'Permissionless interoperability layer connecting Igra to Ethereum, Arbitrum, and 100+ chains. Warp routes enable stablecoins and blue-chip tokens to flow into the Kaspa ecosystem.',
    to: 'https://hyperlane.xyz/',
    type: 'Cross-chain messaging',
    badge: 'mainnet',
  },

  {
    logoUrl: tangem,
    name: 'Tangem',
    description: 'Consumer-grade self-custody hardware wallet in a card form factor. Tap your phone to sign transactions  -  no seed phrase, no charging, bank-grade secure element chip. Now with Igra Network support.',
    to: 'https://tangem.com/',
    type: 'Hardware Wallet',
  },

  {
    logoUrl: kaspacom,
    name: 'Kaspa.com',
    description: 'The #1 Leading Kaspa DeFi Platform  -  DEX, Lending & Borrowing, Launchpad, and NFTs. For the Community, by the Community.',
    to: 'https://kaspa.com',
    type: 'DeFi Platform',
    badge: 'mainnet',
  },

  {
    logoUrl: quex,
    name: 'Quex',
    description: 'Quex is the intelligent data oracle for real-world blockchain applications. Quex leverages the latest advancements in TEEs to deliver first-of-its-kind confidential computing proofs, more efficient than any existing alternative. It enables verifiable access to web data, both public and private, directly from smart contracts with minimal overhead. Quex supports verifiable post-processing, allowing only the necessary data to be extracted and disclosed, ensuring privacy by design. This closes the gap between Web2 data and Web3 applications, enabling the development of truly cross-platform dApps.',
    to: 'https://quex.tech/',
    type: 'Oracle',
    badge: 'mainnet',
  },

  {
    logoUrl: moonbound,
    name: 'Moonbound',
    description: 'Next-gen token launchpad on Igra Network. Fair bonding curves, automatic DEX graduation, TradingView-grade charts. Launch, trade, and earn.',
    to: 'https://moonbound.gg/',
    type: 'Token Launchpad',
    badge: 'testnet',
  },

  {
    logoUrl: katbridge,
    name: 'KAT Alliance',
    description: 'Kaspa Alliance for Transparency - community organization advocating for transparency, accountability, and decentralization across the Kaspa ecosystem.',
    to: 'https://kat.foundation/',
    type: 'Community Partner',
  },

  {
    logoUrl: gscompliance,
    name: 'GS Compliance',
    description: 'GS Automated Compliance Engine is an AI-powered regulatory compliance platform built for energy trading firms, commodity traders, and financial institutions operating across multiple jurisdictions.',
    to: 'https://gscompliance.io/',
    type: 'AI Compliance',
    badge: 'mainnet',
  },

  {
    logoUrl: zelcore,
    name: 'Zelcore',
    description: 'Zelcore is a secure and simple non-custodial crypto wallet that puts you in full control of your digital assets. With seamless functionality across desktop, mobile, and browser extension, you can manage your portfolio anytime, anywhere. Buy, sell, send, receive, and swap crypto - all from one interface.',
    to: 'https://zelcore.io/',
    type: 'Wallet',
    badge: 'mainnet',
  },

  {
    logoUrl: dagscan,
    name: 'DagScan',
    description: 'Explore the Kaspa EVM ecosystem with DagScan - Your gateway to BlockDAG transactions, blocks, and addresses.',
    to: 'https://www.dagscan.xyz/',
    type: 'Blockchain Explorer',
    badge: 'mainnet',
  },

  {
    logoUrl: fervent,
    name: 'Fervent Finance',
    description: 'Fervent Finance - Kaspa\'s decentralized lending and borrowing protocol with risk-isolated pools, dynamic interest rates, and sustainable yield.',
    to: 'https://www.fervent.finance/',
    type: 'DeFi, Lending protocol',
    badge: 'testnet',
  },

  {
    logoUrl: kyo,
    name: 'Kyo',
    description: 'KYO (Keep Your Ownership) gives you the freedom to pay and borrow in crypto without ever giving up what\'s yours. With a simple wallet and card, you can spend instantly, take small loans when needed, and avoid hidden fees  -  all while keeping full ownership of your assets. KYO\'s mission is to make crypto part of everyday life: easy, instant, and fair.',
    to: 'https://kyocard.app/',
    type: 'DeFi, Lending protocol, Card',
    badge: 'testnet',
  },

  {
    logoUrl: nacho,
    name: 'Nacho the Kat',
    description: 'Nacho the Kat - the largest and first fair-launched memecoin on Kaspa.',
    to: 'https://www.nachowyborski.xyz/',
    type: 'Memecoin',
    badge: 'mainnet',
  },

  {
    logoUrl: knexous,
    name: 'Knexous',
    description: 'Knexous is pioneering the future of payments  -  where speed, decentralization, and zero fees converge. Powered by Kaspa and NFC technology, we make crypto payments faster and simpler than cash or cards. Join us in building the next global payment hub.',
    to: 'https://x.com/Knexousnfc',
    type: 'Tap2Pay payment platform',
    badge: 'testnet',
  },

  {
    logoUrl: kasperia,
    name: 'Kasperia',
    description: 'Kasperia  -  The Ultra-Light Kaspa Wallet for Speed, Simplicity & L2 Integration.',
    to: 'https://x.com/KasperiaWallet',
    type: 'Wallet',
    badge: 'mainnet',
  },

  {
    logoUrl: kasware,
    name: 'Kasware',
    description: 'Kasware is the most feature-rich and security-oriented wallet for Kaspa – with support for KRC20, KNS, KRC721 and L2 network.',
    to: 'https://www.kasware.xyz/',
    type: 'Wallet',
    badge: 'mainnet',
  },

  {
    logoUrl: crestdev,
    name: 'Crest Development',
    description: 'Crest Dev Studio is a team of experienced smart contract developers and blockchain specialists creating reliable and efficient products for business and finance. Our solutions blend cutting-edge technology with intuitive design, making complex concepts simple and accessible.',
    type: 'Development Studio',
  },

  {
    logoUrl: kastle,
    name: 'Kastle',
    description: 'Kaspa wallet - send, receive and manage your Kaspa assets with ease and security and be the king of your own Kastle.',
    to: 'https://kastle.cc/',
    type: 'Wallet',
    badge: 'mainnet',
  },

  {
    logoUrl: aporia,
    name: 'Aporia',
    description: 'The first true CLOB DEX on Kaspa: MEV Resistant, trustless interoperability, atomically composable, fully on-chain.',
    to: 'https://x.com/aporiaexchange',
    type: 'DeFi, CLOB DEX',
    badge: 'testnet',
  },

  {
    logoUrl: kaspafinance,
    name: 'Kaspa Finance',
    description: 'KaspaFinance.io is the first full-suite DeFi super protocol built on the Kaspa L2. From V3-style concentrated liquidity AMMs, Farming and LPs, borrowing and lending, token creation, to AI-powered trading bots and NLP trading, KFC (Kaspa Finance) brings Ethereum-grade DeFi infrastructure to the fastest proof-of-work blockchain in existence.',
    to: 'https://kaspafinance.io/',
    type: 'DeFi Platform',
    badge: 'testnet',
  },

  {
    logoUrl: spectre,
    name: 'Spectre Market',
    description: 'Spectre Market is Kaspa\'s premier NFT marketplace built on Igra L2, enabling you to deploy NFT collections, mint tokens, trade digital assets, and stake NFTs for rewards - all with the speed and security of Kaspa\'s BlockDAG technology.',
    to: 'https://spectre.market/',
    type: 'NFT Marketplace',
    badge: 'testnet',
  },

  {
    logoUrl: kaspulse,
    name: 'KaspaPulse',
    description: 'KaspaPulse is an independent community-driven account dedicated to supporting the Kaspa ecosystem by sharing news, insights, and updates about the project. Our mission is to raise awareness, provide simplified explanations of Kaspa\'s innovative BlockDAG technology, and keep the community informed about ongoing developments. KaspaPulse is not an official entity, but rather a supportive initiative for the global Kaspa community.',
    to: 'https://x.com/KaspaPulse',
    type: 'Application',
  },

  {
    logoUrl: tbdai,
    name: 'TBDai',
    description: 'The Business Directory is a 32M+ on-chain B2B platform with AI assistants for discovery, insights, and automation. Focused on growing and connecting your business - enjoy being decentralized, scalable, and built for seamless interconnectivity to an evolving world.',
    to: 'https://x.com/TBDai_Official',
    type: 'Business Directory',
  },

]

function splitIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const columns: T[][] = Array.from({ length: columnCount }, () => [])

  items.forEach((item, index) => {
    const col = index % columnCount
    columns[col].push(item)
  })

  return columns
}

export const ProjectsList: FC = () => {
  const columnsCount =
  window.innerWidth < 769 ? 1 :
    window.innerWidth < 1025 ? 2 :
      3

  const columns = splitIntoColumns(projects, columnsCount)

  return (
    <Flex gap={40}>
      {columns.map((column, index) => (
        <Flex
          key={`column-${index}`}
          fullWidth
          flexDirection='column'
          gap={30}
        >
          {column.map((project, index) => (
            <Fragment key={`project-${index}`}>
              <a href={project.to} target='_blank' rel='noreferrer'>
                <Card {...project} />
              </a>
            </Fragment>
          ))}
        </Flex>
      ))}
    </Flex>
  )
}
