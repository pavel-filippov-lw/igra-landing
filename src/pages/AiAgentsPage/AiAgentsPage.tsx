import { FC, useState } from 'react'

import { LatestNews, PageLayout } from '~/Components'
import { Icon } from '~/shared/ui'

import heroAgents from './assets/hero-agents.png'
import iconAccounts from './assets/icon-accounts.png'
import iconEscrow from './assets/icon-escrow.png'
import iconPayments from './assets/icon-payments.png'
import iconPermissions from './assets/icon-permissions.png'
import classes from './AiAgentsPage.module.scss'

const DOCS = 'https://igra-labs.gitbook.io/igralabs-docs/for-developers'

interface Feature {
  icon: string
  title: string
  desc: string
  /** Call to action, linking to the page about it in the docs. */
  cta: string
  link: string
}

// High-level descriptions, kept in line with the docs' AI Agents section.
const FEATURES: Feature[] = [
  {
    icon: iconEscrow,
    title: 'ERC-8183 Agentic Commerce',
    desc: 'On-chain job escrow between clients, providers and evaluators. A provider, human or AI agent, does the work, and an evaluator verifies delivery before payment is released.',
    cta: 'Start using Agentic Commerce',
    link: `${DOCS}/ai-agents/agentic-commerce`,
  },
  {
    icon: iconPayments,
    title: 'x402 Agentic Payments',
    desc: 'Pay per HTTP request in USDC. An API asks for payment with a 402 response, and the client pays and gets the content.',
    cta: 'Read how to charge per request with x402',
    link: `${DOCS}/ai-agents/x402-payments`,
  },
  {
    icon: iconPermissions,
    title: 'ERC-7710 Permissions',
    desc: 'An account signs a delegation that lets another address, such as an agent, act on its behalf within limits it sets.',
    cta: 'Start using ERC-7710 delegations',
    link: `${DOCS}/contract-addresses/delegation-framework`,
  },
  {
    icon: iconAccounts,
    title: 'EIP-7702 and ERC-4337 Smart Accounts',
    desc: 'Smart accounts, batched calls and paying gas in USDC. An EOA can delegate execution to code and act like a smart account.',
    cta: 'Read how to build with smart accounts',
    link: `${DOCS}/ai-agents/building-with-account-abstraction`,
  },
]

// The docs' MCP endpoint. A browser gets 405 there, so it is shown to copy, not linked.
const MCP_SERVER = 'https://igra-labs.gitbook.io/igralabs-docs/~gitbook/mcp'

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 3.5V3A1.5 1.5 0 0 0 9 1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5" />
  </svg>
)

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
)

/** The whole box copies `text`; its icon briefly turns into a check, like the auction page's anchor links. */
const CopyBox: FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }, () => {})
  }
  const label = copied ? 'Copied' : 'Copy the MCP server address'
  return (
    <button type="button" className={classes.mcp} onClick={copy} aria-label={label} title={label}>
      <code className={classes.mcpUrl}>{text}</code>
      <span className={classes.copyIcon}>{copied ? <CheckIcon /> : <CopyIcon />}</span>
    </button>
  )
}

export const AiAgentsPage: FC = () => (
  <PageLayout>
    <div className={classes.root}>
      <section className={classes.hero}>
        <div className={classes.heroText}>
          <h1 className={classes.heroTitle}>AI Agents on Igra</h1>
          <p className={classes.heroLead}>
            Building blocks for AI agents that transact on Igra. To give your agent the docs, add this MCP
            server to any MCP client:
          </p>
          <CopyBox text={MCP_SERVER} />
        </div>
        <img src={heroAgents} alt="" aria-hidden="true" className={classes.heroArt} />
      </section>

      <div className={classes.features}>
        {FEATURES.map((f) => (
          <div key={f.title} className={classes.featureRow}>
            <img src={f.icon} alt="" aria-hidden="true" className={classes.featureIcon} />
            <div className={classes.featureText}>
              <h2 className={classes.featureTitle}>{f.title}</h2>
              <p className={classes.featureDesc}>{f.desc}</p>
              <a href={f.link} target="_blank" rel="noopener noreferrer" className={classes.featureCta}>
                {f.cta}
                <Icon name='arrowTopRight' size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <a href={`${DOCS}/ai-agents`} target="_blank" rel="noopener noreferrer" className={classes.docsLink}>
        All AI Agents guides
        <Icon name='arrowTopRight' size={10} />
      </a>

      <LatestNews />
    </div>
  </PageLayout>
)
