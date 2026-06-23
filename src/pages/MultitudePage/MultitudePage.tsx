import { FC, useRef } from "react"

import { PageLayout } from "~/Components"

import multitudeImage from './assets/multitude.png'
import iconWhyCost from './assets/icon-why-cost.png'
import iconWhyThroughput from './assets/icon-why-throughput.png'
import iconWhySequencer from './assets/icon-why-sequencer.png'
import iconWhyManaged from './assets/icon-why-managed.png'
import classes from './MultitudePage.module.scss'

const coreFeatures = [
  'Bitcoin-grade security of the Kaspa blockDAG validator set',
  'Up to 3,000 TPS throughput and subsecond probabilistic finality',
  'Liveness of blockDAG validator set',
  'Structural MEV resilience',
  'Full EVM compatibility',
]

const deploymentModels = [
  {
    title: 'Managed Zone',
    intro: 'Fastest and lowest-cost path.',
    bullets: [
      'Runs on Igra-operated infrastructure',
      'RPC, explorer, integrations, monitoring',
      'Custom gas and fee settings',
      'Best for pilots, trading apps, small teams',
    ],
  },
  {
    title: 'Dedicated Zone',
    intro: 'More isolation and control.',
    bullets: [
      'Dedicated customer infrastructure',
      'Dedicated RPC, explorer, and indexing',
      'Custom access rules and compliance controls',
      'Best for trading desks, hedge funds, regulated finance apps',
    ],
  },
  {
    title: 'Independent Chain',
    intro: 'Maximum sovereignty.',
    bullets: [
      'Separate Igra/Kaspa-based chain',
      'Own infrastructure boundary',
      'Own economics, roadmap, integrations',
      'Best for appchain teams and larger finance products',
    ],
  },
]

const whyFeatures = [
  {
    icon: iconWhyCost,
    title: 'Lower infrastructure cost',
    text: 'For teams that need their own chain before they have a large infra budget or 24/7 ops team.',
  },
  {
    icon: iconWhyThroughput,
    title: 'Higher throughput, lower latency',
    text: 'Designed for trading and finance workloads where latency, cost, and throughput matter.',
  },
  {
    icon: iconWhySequencer,
    title: 'No centralized sequencer',
    text: 'Transactions are not ordered by a vendor-operated sequencer. This reduces capture, censorship, and MEV concentration risks.',
  },
  {
    icon: iconWhyManaged,
    title: 'Managed operations',
    text: 'Igra handles infrastructure, monitoring, upgrades, RPC, explorer, and integrations depending on the selected model.',
  },
]

const customerControls = [
  'Chain or zone economics',
  'Gas token and fee logic',
  'Access rules',
  'Product roadmap',
  'Integrations',
  'Application layer',
]

const igraHandles = [
  'Node operations',
  'RPC endpoints',
  'Block Explorers',
  '24/7 Monitoring',
  'Software Upgrades',
  'Infrastructure',
  'Tech Support',
]

const useCasesData = [
  'Trading venue or internal execution environment',
  'Hedge fund settlement / strategy infrastructure',
  'Appchain migration from expensive infra',
  'Finance app needing dedicated throughput',
  'Compliance-controlled EVM environment',
  'High-frequency onchain product pilot',
]

const comparisonRows = [
  { label: 'Sequencer model', standard: 'Vendor-operated', multitude: 'Kaspa blockDAG validators' },
  { label: 'Cost profile', standard: 'Higher baseline', multitude: 'Lower, scales with usage' },
  { label: 'Throughput profile', standard: 'Shared or capped', multitude: 'Up to 3,000 TPS dedicated' },
  { label: 'Infrastructure operations', standard: 'Customer or vendor', multitude: 'Managed by Igra' },
  { label: 'Custom gas / fee logic', standard: 'Limited', multitude: 'Full control' },
  { label: 'Vendor dependency', standard: 'Sequencer is control point', multitude: 'Neutral settlement layer' },
  { label: 'Deployment speed', standard: 'Weeks to months', multitude: 'Days to weeks' },
]

const CALENDLY_URL = 'https://calendly.com/emdin/20-minute-meeting'

export const MultitudePage: FC = () => {
  const exploreRef = useRef<HTMLDivElement>(null)

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <PageLayout hideBg>
      <div className={classes.root}>
        {/* 1. Hero */}
        <div className={classes.hero}>
          <div className={classes.heroContent}>
            <h1 className={classes.title}>IGRA MULTITUDE</h1>
            <h2 className={classes.subtitle}>
              Deploy your own sovereign finance infrastructure
            </h2>
            <p className={classes.description}>
              Multitude gives trading teams, finance apps, and appchain founders dedicated EVM
              infrastructure with Bitcoin-grade security without enterprise-stack costs or a
              centralized sequencer.
            </p>
            <p className={classes.description}>
              Managed chain infrastructure for teams that need control, performance, and faster
              launch without running a full infra stack.
            </p>
            <div className={classes.heroCta}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={classes.btnPrimary}>
                Talk to us
              </a>
              <button onClick={scrollToExplore} className={classes.btnSecondary}>
                Explore
              </button>
            </div>
          </div>
          <div className={classes.imageWrapper}>
            <img src={multitudeImage} alt="Multitude" className={classes.image} />
          </div>
        </div>

        <div className={classes.details} ref={exploreRef}>
          {/* Deployment Models */}
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Deployment Tiers</h2>
            <div className={classes.modelGrid}>
              {deploymentModels.map((model, i) => (
                <div key={i} className={classes.modelCard}>
                  <h3 className={classes.modelTitle}>{model.title}</h3>
                  <p className={classes.modelIntro}>{model.intro}</p>
                  <p className={classes.modelIncludes}>Includes:</p>
                  <ul className={classes.modelBullets}>
                    {model.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Why Multitude */}
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Why Multitude</h2>
            <div className={classes.whyGrid}>
              {whyFeatures.map((f, i) => (
                <div key={i} className={classes.whyCard}>
                  <img src={f.icon} alt={f.title} className={classes.whyCardIcon} />
                  <h3 className={classes.whyCardTitle}>{f.title}</h3>
                  <p className={classes.whyCardText}>{f.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. What you control / what we operate */}
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>What you control / what we operate</h2>
            <div className={classes.splitGrid}>
              <div className={classes.splitCard}>
                <h3 className={classes.splitCardTitle}>You control</h3>
                <ul className={classes.splitList}>
                  {customerControls.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={classes.splitCard}>
                <h3 className={classes.splitCardTitle}>We handle</h3>
                <ul className={classes.splitList}>
                  {igraHandles.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 7. Use Cases */}
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Use Cases</h2>
            <div className={classes.useCaseCards}>
              {useCasesData.map((uc, i) => (
                <div key={i} className={classes.useCaseCard}>{uc}</div>
              ))}
            </div>
          </section>

          {/* 8. Comparison */}
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Comparison</h2>
            <div className={classes.comparisonTable}>
              <div className={`${classes.compRow} ${classes.compHeader}`}>
                <div className={classes.compCell} />
                <div className={classes.compCell}>Standard managed appchain</div>
                <div className={classes.compCell}>Multitude</div>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={i} className={classes.compRow}>
                  <div className={`${classes.compCell} ${classes.compLabel}`}>{row.label}</div>
                  <div className={classes.compCell}>{row.standard}</div>
                  <div className={`${classes.compCell} ${classes.compHighlight}`}>{row.multitude}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className={classes.finalCta}>
            <h2 className={classes.finalCtaTitle}>Launch a pilot zone</h2>
            <p className={classes.finalCtaText}>
              Tell us what you are building. We will help choose the right tier.
            </p>
            <div className={classes.finalCtaButtons}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={classes.btnPrimary}>
                Talk to the team
              </a>
              <a href="https://igra-labs.gitbook.io/" target="_blank" rel="noopener noreferrer" className={classes.btnSecondary}>
                View documentation
              </a>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
