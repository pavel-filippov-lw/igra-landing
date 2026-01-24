import clsx from "clsx"
import { FC } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { PageLayout } from "~/Components"
import { Benefit } from "~/Components/HeroBenefits/Card"
import { to } from "~/shared/lib"
import { ClockIcon, Icon, StackIcon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

import classes from './BenefitsPage.module.scss'

const benefitsList: Benefit[] = [
  {
    iconName: 'stack',
    iconLabel: 'Security',
    title: () => 'Bitcoin-grade security',
    description: () => (
      <>
        {'Bitcoin\'s $1.5T market cap isn\'t a fluke. Lindy effect in action: it proved resilient, non-censorable, non-capturable. PoS chains made security and decentralization tradeoffs that serious financial actors won\'t accept. Bitcoin captured 10x the liquidity of any other decentralized currency because attack cost scales with locked value.'}
        <br />
        <br />
        {'Yes, auditability and other properties still prevent programmable systems from fully replacing traditional finance. But security is the foundation. Without it, nothing else matters.'}
        <br />
        <br />
        {'Kaspa is the only system comparable to Bitcoin in security design. Same PoW consensus principles, same economic security model where attack cost scales with network value.'}
        <br />
        <br />
        {'Igra inherits this security directly. As a based rollup, Igra uses Kaspa\'s PoW network as its sequencer. No centralized operator, no validator set to capture. Transaction ordering is determined by Kaspa miners, meaning attacks on Igra require attacking Kaspa itself. Smart contracts protected by real hashpower is what institutional players need to consider decentralized apps.'}
      </>
    ),
    to: to.benefits('0'),
  },
  {
    iconName: 'clock',
    iconLabel: 'MEV Protection',
    title: () => 'MEV and censorship resistant',
    description: () => (
      <>
        <span className={classes.boldText}>Value extraction</span>
        <br />
        {'MEV and frontrunning cost users $500M+ annually. 80%+ of Ethereum blocks are built by two builders. The people ordering your transactions profit from your trades.'}
        <br />
        <br />
        <span className={classes.boldText}>Solution:</span>
        <br />
        {'Igra separates execution from sequencing. Kaspa miners order opaque transaction data without knowledge of EVM state or the value inside. No visibility means no sandwich attacks, no frontrunning, no extraction.'}
        <br />
        <br />
        <span className={classes.boldText}>Problem: Censorship by capital</span>
        <br />
        {'PoS lets token holders decide what gets included. Hyperliquid manipulated its oracle to avoid losses. Flow attempted to rollback 6 hours of history. Concentrated stake means concentrated power.'}
        <br />
        <br />
        <span className={classes.boldText}>Solution:</span>
        <br />
        {'Kaspa\'s blockDAG produces parallel blocks across thousands of independent miners. Censoring an Igra transaction requires bribing a majority of miners who cannot even identify which transactions to censor. The coordination problem is the protection.'}
        <br />
        <br />
        <span className={classes.boldText}>Problem: Regulatory capture</span>
        <br />
        {'Centralized sequencers are single points of subpoena. Tornado Cash was sanctioned. Your L2\'s sequencer is next. One legal notice freezes the entire chain.'}
        <br />
        <br />
        <span className={classes.boldText}>Solution:</span>
        <br />
        {'Igra has no operator to serve. Transaction ordering inherits Kaspa\'s globally distributed PoW network. No company runs the sequencer because there is no sequencer. Shutting down Igra means shutting down Kaspa.'}
      </>
    ),
    to: to.benefits('1'),
  },
  {
    iconName: 'molecule',
    iconLabel: 'Quantum Safe',
    title: () => 'Post Quantum Cryptography resilient',
    to: to.benefits('2'),
  },
  {
    iconName: 'blocks',
    iconLabel: 'Zone Architecture',
    title: () => 'Independent logical zones',
    to: to.benefits('3'),
  },
  {
    iconName: 'lock',
    iconLabel: 'Privacy',
    title: () => 'Secure privacy',
    to: to.benefits('4'),
  },
  {
    iconName: 'flag',
    iconLabel: 'Swiss Compliance',
    title: () => 'Swiss registered company',
    description: () => (
      <>
        Igra Association and the $IGRA utility token are registered in Switzerland, Zug. MiCA paper submitted, ensuring clear legal responsibility and transparent management of funds.
      </>
    ),
    to: to.benefits('5'),
  },
  {
    iconName: 'ethereum',
    iconLabel: 'EVM Compatible',
    title: () => 'EVM-compatible',
    description: () => (
      <>
        Full EVM compatibility, 400K+ Solidity devs, no cold start, clear audit frameworks. Igra provides seamless integration with existing Ethereum tooling and infrastructure, enabling developers to deploy their smart contracts without modification.
        <br />
        <br />
        <span className={classes.boldText}>No learning curve</span>
        <br />
        Developers can use familiar tools like Hardhat, Truffle, Remix, and MetaMask. All existing Solidity contracts work out of the box.
        <br />
        <br />
        <span className={classes.boldText}>Proven ecosystem</span>
        <br />
        Access to the entire Ethereum ecosystem - DeFi protocols, NFT standards, oracles, and more. Everything that works on Ethereum works on Igra.
        <br />
        <br />
        <span className={classes.boldText}>Security audits</span>
        <br />
        Leverage existing audit frameworks and security best practices from Ethereum. No need to reinvent security standards.
      </>
    ),
    to: to.benefits('6'),
  },
]

export const BenefitsPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const benefitId = searchParams.get('benefitId')
  const benefit = benefitsList.find((_, index) => index.toString() === benefitId) ?? benefitsList[0]

  const animatedIcons: Partial<Record<IconName, React.ReactNode>> = {
    stack: <StackIcon size={300} />,
    clock: <ClockIcon size={300} />,
    molecule: <Icon name='molecule' size={300} />,
    blocks: <Icon name='blocks' size={300} />,
    lock: <Icon name='lock' size={300} />,
    flag: <Icon name='flag' size={300} />,
    ethereum: <Icon name='ethereum' size={300} />,
  }

  const handleNavigation = (index: number) => {
    document.getElementById('benefits-content')?.scrollTo({
      top: 0,
      behavior: 'instant',
    })
    navigate(to.benefits(index.toString()))
  }

  return (
    <PageLayout>
      <div className={classes.root}>
        {animatedIcons[benefit.iconName]}
        <div className={classes.card}>
          <div id='benefits-content' className={classes.content}>
            <div className={classes.title}>{benefit.title()}</div>
            <div className={classes.description}>
              {benefit.description?.()}
            </div>
          </div>
          <div className={classes.navigation}>
            {benefitsList.map((benefit, index) => (
              <div key={index} className={classes.item} onClick={() => handleNavigation(index)}>
                <Icon
                  name={benefit.iconName}
                  size={75}
                  className={clsx(classes.icon, {
                    [classes.inactive]: index.toString() !== benefitId,
                  })}
                />
                {benefit.iconLabel && (
                  <div className={clsx(classes.iconLabel, {
                    [classes.inactive]: index.toString() !== benefitId,
                  })}>
                    {benefit.iconLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
