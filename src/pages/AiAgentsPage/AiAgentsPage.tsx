import { FC } from 'react'

import { LatestNews, PageLayout } from '~/Components'

import heroAgents from './assets/hero-agents.png'
import iconAccounts from './assets/icon-accounts.png'
import iconEscrow from './assets/icon-escrow.png'
import iconPayments from './assets/icon-payments.png'
import iconPermissions from './assets/icon-permissions.png'
import classes from './AiAgentsPage.module.scss'

interface Feature {
  icon: string
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    icon: iconEscrow,
    title: 'ERC-8183 Agentic Commerce',
    desc: 'Job escrow with evaluator attestation for agent commerce.',
  },
  {
    icon: iconPayments,
    title: 'x402 Agentic Payments',
    desc: 'Internet-native stablecoin payments.',
  },
  {
    icon: iconPermissions,
    title: 'ERC-7710 Permissions',
    desc: 'Delegated, bounded permissions for secure agent action.',
  },
  {
    icon: iconAccounts,
    title: 'EIP-7702 and ERC-4337 Smart Accounts',
    desc: 'An EOA can delegate execution to code and act like a smart account. UserOperations via bundlers and EntryPoint for programmable accounts.',
  },
]

export const AiAgentsPage: FC = () => (
  <PageLayout>
    <div className={classes.root}>
      <section className={classes.hero}>
        <h1 className={classes.heroTitle}>The TTL agentic commerce job</h1>
        <img src={heroAgents} alt="" aria-hidden="true" className={classes.heroArt} />
      </section>

      <div className={classes.features}>
        {FEATURES.map((f) => (
          <div key={f.title} className={classes.featureRow}>
            <img src={f.icon} alt="" aria-hidden="true" className={classes.featureIcon} />
            <div className={classes.featureText}>
              <h2 className={classes.featureTitle}>{f.title}</h2>
              <p className={classes.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <LatestNews />
    </div>
  </PageLayout>
)
