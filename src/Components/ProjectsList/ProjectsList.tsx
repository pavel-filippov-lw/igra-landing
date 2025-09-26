import { FC, Fragment } from "react"

import aporia from './assets/aporia.png'
import crestdev from './assets/crestdev.png'
import dagscan from './assets/dagscan.png'
import fervent from './assets/fervent.png'
import kaskad from './assets/kaskad.png'
import kasname from './assets/kasname.png'
import kaspacom from './assets/kaspacom.png'
import kaspafinance from './assets/kaspafinance.png'
import kaspulse from './assets/kaspulse.png'
import kastle from './assets/kastle.png'
import kasware from './assets/kasware.png'
import kasway from './assets/kasway.png'
import kyo from './assets/kyo.png'
import moonbound from './assets/moonbound.png'
import nacho from './assets/nacho.png'
import lightbeam from './assets/lightbeam.png'
import quex from './assets/quex.png'
import seaswap from './assets/seaswap.png'
import slow from './assets/slow.png'
import tbdai from './assets/tbdai.png'
import zealous from './assets/zealous.png'
import zelcore from './assets/zelcore.png'
import igraway from './assets/igraway.png'

import { Card, Project } from "./Card"
import classes from './ProjectsList.module.scss'

const projects: Project[] = [

    {
    logoUrl: quex,
    name: 'Quex',
    description: 'Quex is the intelligent data oracle for real-world blockchain applications. Quex leverages the latest advancements in TEEs to deliver first-of-its-kind confidential computing proofs, more efficient than any existing alternative. It enables verifiable access to web data, both public and private, directly from smart contracts with minimal overhead. Quex supports verifiable post-processing, allowing only the necessary data to be extracted and disclosed, ensuring privacy by design. This closes the gap between Web2 data and Web3 applications, enabling the development of truly cross-platform dApps.',
    to: 'https://quex.tech/',
    type: 'Oracle',
  },

    {
    logoUrl: zelcore,
    name: 'Zelcore',
    description: 'Zelcore is a secure and simple non-custodial crypto wallet that puts you in full control of your digital assets. With seamless functionality across desktop, mobile, and browser extension, you can manage your portfolio anytime, anywhere. Buy, sell, send, receive, and swap crypto - all from one interface.',
    to: 'https://zelcore.io/',
    type: 'Wallet',
  },


  {
    logoUrl: kaskad,
    name: 'Kaskad',
    description: 'Fully decentralized lending protocol, tailored for Kaspa’s high-speed architecture.',
    to: 'https://kaskad.app/',
    type: 'DeFi, Lending protocol',
  },

    {
    logoUrl: dagscan,
    name: 'DagScan',
    description: 'Explore the Kaspa EVM ecosystem with DagScan - Your gateway to BlockDAG transactions, blocks, and addresses.',
    to: 'https://www.dagscan.xyz/',
    type: 'Blockchain Explorer',
  },
  {
    logoUrl: kaspacom,
    name: 'Kaspa.com',
    description: 'The #1 Leading Kaspa DeFi Platform — DEX, Lending & Borrowing, Launchpad, and NFTs. For the Community, by the Community.',
    to: 'https://kaspa.com',
    type: 'DeFi Platform',
  },

    {
    logoUrl: zealous,
    name: 'Zealous Swap',
    description: 'Zealous Swap - Kaspa’s first AMM DEX with NFT-based fees, protocol-owned liquidity, insurance fund, and modular fees.',
    to: 'https://www.zealousswap.com/',
    type: 'DeFi, DEX',
  },
  {
    logoUrl: fervent,
    name: 'Fervent Finance',
    description: 'Fervent Finance - Kaspa’s decentralized lending and borrowing protocol with risk-isolated pools, dynamic interest rates, and sustainable yield.',
    to: 'https://www.fervent.finance/',
    type: 'DeFi, Lending protocol',
  },

    {
    logoUrl: kyo,
    name: 'Kyo',
    description: 'KYO (Keep Your Ownership) gives you the freedom to pay and borrow in crypto without ever giving up what’s yours. With a simple wallet and card, you can spend instantly, take small loans when needed, and avoid hidden fees — all while keeping full ownership of your assets. KYO’s mission is to make crypto part of everyday life: easy, instant, and fair.',
    to: 'https://kyocard.app/',
    type: 'DeFi, Lending protocol, Card',
  },
  {
    logoUrl: nacho,
    name: 'Nacho the Kat',
    description: 'Nacho the Kat - the largest and first fair-launched memecoin on Kaspa.',
    to: 'https://www.nachowyborski.xyz/',
    type: 'Memecoin',
  },


    {
    logoUrl: crestdev,
    name: 'Crest Development',
    description: 'Crest Dev Studio is a team of experienced smart contract developers and blockchain specialists creating reliable and efficient products for business and finance. Our solutions blend cutting-edge technology with intuitive design, making complex concepts simple and accessible.',
    to: 'http://crestdev.pro/',
    type: 'Development Studio',
  },

    {
    logoUrl: kastle,
    name: 'Kastle',
    description: 'Kaspa wallet - send, receive and manage your Kaspa assets with ease and security and be the king of your own Kastle.',
    to: 'https://kastle.cc/',
    type: 'Wallet',
  },


  {
    logoUrl: aporia,
    name: 'Aporia',
    description: 'The first true CLOB DEX on Kaspa: MEV Resistant, trustless interoperability, atomically composable, fully on-chain.',
    to: 'https://x.com/aporiaexchange',
    type: 'DeFi, CLOB DEX',
  },
  {
    logoUrl: kaspafinance,
    name: 'Kaspa Finance',
    description: 'KaspaFinance.io is the first full-suite DeFi super protocol built on the Kaspa L2. From V3-style concentrated liquidity AMMs, Farming and LPs, borrowing and lending, token creation, to AI-powered trading bots and NLP trading, KFC (Kaspa Finance) brings Ethereum-grade DeFi infrastructure to the fastest proof-of-work blockchain in existence.',
    to: 'https://kaspafinance.io/',
    type: 'DeFi Platform',
  },
    {
    logoUrl: igraway,
    name: 'Igraway',
    description: 'The gateway bringing stablecoins into the Igra ecosystem, empowering seamless cross-chain liquidity.',
    to: 'https://igraway.com/',
    type: 'EVM Bridge',
  },
  {
    logoUrl: kaspulse,
    name: 'KaspaPulse',
    description: 'KaspaPulse is an independent community-driven account dedicated to supporting the Kaspa ecosystem by sharing news, insights, and updates about the project. Our mission is to raise awareness, provide simplified explanations of Kaspa’s innovative BlockDAG technology, and keep the community informed about ongoing developments. KaspaPulse is not an official entity, but rather a supportive initiative for the global Kaspa community.',
    to: 'https://x.com/KaspaPulse',
    type: 'Application',
  },
  {
    logoUrl: kasware,
    name: 'Kasware',
    description: 'Kasware is the most feature-rich and security-oriented wallet for Kaspa – with support for KRC20, KNS, KRC721 and L2 network.',
    to: 'https://www.kasware.xyz/',
    type: 'Wallet',
  },
  {
    logoUrl: kasway,
    name: 'Kasway',
    description: 'Kasway is a project that aims to deliver real world utilities, non-trading applications for the Kaspa ecosystem.',
    to: 'https://kasway.xyz/',
    type: 'PoS',
  },
  {
    logoUrl: moonbound,
    name: 'Moonbound',
    description: 'The next-gen platform transforming tokens from fleeting pumps into sustainable moon missions. Powered by EVM on Kaspa, we’re fueling fair, high-velocity launches built to last. Lock in. Liftoff begins now.',
    to: 'https://moonbound.gg',
    type: 'Token Launchpad',
  },
  {
    logoUrl: seaswap,
    name: 'Sea Swap',
    description: 'We’re building SeaSwap to help users get the best swap rates across multiple DEXs on Kaspa L2s like Igra. By aggregating liquidity and routing trades through the most efficient paths, we’re aiming to make DeFi on Kaspa smooth and accessible.',
    to: 'https://seaswap.xyz/',
    type: 'DeFi, DEX Aggregator',
  },
  {
    logoUrl: slow,
    name: 'Slow',
    description: 'SLOW is a fair community memecoin on Kaspa, inspired by Yonatan Sompolinsky’s turtle “Bitcoin.” With no premine, it celebrates grassroots culture, transparency, and accessibility. Bitcoin just does better on $KAS - there is no second best.',
    to: 'https://x.com/slowlikebtc',
    type: 'Memecoin',
  },
  {
    logoUrl: tbdai,
    name: 'TBDai',
    description: 'The Business Directory is a 32M+ on-chain B2B platform with AI assistants for discovery, insights, and automation. Focused on growing and connecting your business - enjoy being decentralized, scalable, and built for seamless interconnectivity to an evolving world.',
    to: 'https://x.com/TBDai_Official',
    type: 'Business Directory',
  },
    {
    logoUrl: kasname,
    name: 'Kasname',
    description: 'Digital Identity On Kaspa.',
    to: 'https://app.knsdomains.org/',
    type: 'dApp',
  },
    {
    logoUrl: lightbeam,
    name: 'Lightbeam',
    description: 'Advanced Order Book DEX.',
    type: 'DeFi, CLOB DEX',
    to: 'https://lightbeam.finance/',
  },


]

export const ProjectsList: FC = () => {
  return (
    <div className={classes.root}>
      {projects.map((project, index) => (
        <Fragment key={index}>
          <a href={project.to} target='_blank' rel='noreferrer'>
            <Card {...project} />
          </a>
        </Fragment>
      ))}
    </div>
  )
}
