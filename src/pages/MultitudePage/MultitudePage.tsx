import { FC, useRef } from "react"

import { PageLayout } from "~/Components"

import multitudeImage from './assets/multitude.png'
import iconWhyCost from './assets/icon-why-cost.png'
import iconWhyThroughput from './assets/icon-why-throughput.png'
import iconWhySequencer from './assets/icon-why-sequencer.png'
import iconWhyManaged from './assets/icon-why-managed.png'
import classes from './MultitudePage.module.scss'

const deploymentModels = [
  {
    title: 'Managed Zone',
    intro: 'Fastest launch path, lowest setup cost.',
    bullets: [
      'Runs on Igra-managed infrastructure',
      'RPC, explorer, integrations, monitoring',
      'Custom gas and fee settings',
      'Best for pilots, finance apps, small teams',
    ],
  },
  {
    title: 'Dedicated Zone',
    intro: 'Isolation and compliance.',
    bullets: [
      'Dedicated customer infrastructure',
      'Dedicated RPC, explorer, and indexing',
      'Custom access rules and compliance controls',
      'Best for settlement systems, treasury flows, and regulated finance apps',
    ],
  },
  {
    title: 'Independent Chain',
    intro: 'Maximum sovereignty.',
    bullets: [
      'Separate chain built on Igra infrastructure',
      'Dedicated infrastructure boundary',
      'Independent economics, roadmap, and integrations',
      'Best for appchain teams and larger finance products',
    ],
  },
]

const whyFeatures = [
  {
    icon: iconWhyCost,
    title: 'Lower setup and operating costs',
    text: 'Lower setup and operating costs than enterprise managed-chain stacks. For teams that need their own chain without a large infra budget or a 24/7 ops team.',
  },
  {
    icon: iconWhyThroughput,
    title: 'Dedicated throughput',
    text: 'Fast inclusion and dedicated throughput for finance applications.',
  },
  {
    icon: iconWhySequencer,
    title: 'No vendor-run sequencer',
    text: 'Ordered by an external ordering network, not a vendor-run sequencer. This reduces capture, censorship, and MEV concentration risks.',
  },
  {
    icon: iconWhyManaged,
    title: 'Reduced MEV and front-running risk',
    text: 'External ordering removes the vendor sequencer as the capture point, reducing MEV extraction and front-running.',
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
  'Managed operations',
  'Node operations',
  'RPC endpoints',
  'Block Explorers',
  '24/7 Monitoring',
  'Software Upgrades',
  'Infrastructure',
  'Tech Support',
]

const useCasesData = [
  'Settlement and treasury infrastructure',
  'Finance app needing dedicated throughput',
  'Migration from expensive appchain infra',
  'Compliance-controlled EVM environment',
  'Internal finance execution environment',
  'Appchain teams moving to managed infrastructure',
]

const comparisonRows = [
  { label: 'Sequencer model', standard: 'Vendor sequencer', multitude: 'Kaspa BlockDAG ordering network' },
  { label: 'Cost profile', standard: 'Higher baseline', multitude: 'Lower setup and operating costs' },
  { label: 'Throughput profile', standard: 'Shared or capped', multitude: 'Dedicated throughput for finance workloads' },
  { label: 'Infrastructure operations', standard: 'Customer or vendor', multitude: 'Managed by Igra' },
  { label: 'Custom gas / fee logic', standard: 'Limited', multitude: 'Full control' },
  { label: 'Vendor dependency', standard: 'Sequencer is the control point', multitude: 'No sequencer control point' },
  { label: 'Deployment speed', standard: 'Weeks to months', multitude: 'Pilot in days to weeks; fully managed in 1–2 months' },
]

const CALENDLY_URL = 'https://calendly.com/emdin/20-minute-meeting'
const DOCS_URL = 'https://igra-labs.gitbook.io/igralabs-docs/igra-multitude'

export const MultitudePage: FC = () => {
  const exploreRef = useRef<HTMLDivElement>(null)

  return (
    <PageLayout hideBg>
      <div className={classes.root}>
        {/* 1. Hero */}
        <div className={classes.hero}>
          <div className={classes.heroContent}>
            <h1 className={classes.title}>IGRA MULTITUDE</h1>
            <h2 className={classes.subtitle}>
              Deploy your sovereign finance chain infrastructure
            </h2>
            <p className={classes.description}>
              Multitude lets finance apps, settlement systems, and appchain teams launch dedicated
              EVM chain infrastructure with lower setup costs, dedicated throughput, and reduced
              ordering and MEV capture risk.
            </p>
            <p className={classes.description}>
              Ordered by Kaspa BlockDAG, an independent proof-of-work network, not a vendor-run
              sequencer. Fully managed deployment so you can launch without building a full infra team.
            </p>
            <div className={classes.heroCta}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={classes.btnPrimary}>
                Talk to us
              </a>
              <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className={classes.btnSecondary}>
                Read docs
              </a>
            </div>
          </div>
          <div className={classes.imageWrapper}>
            <img src={multitudeImage} alt="Multitude" className={classes.image} />
          </div>
        </div>

        <div className={classes.details} ref={exploreRef}>
          {/* Deployment Models */}
          <section className={classes.section}>
            <h2 className={classes.sectionTitle}>Deployment Models</h2>
            <p className={classes.sectionSubtitle}>Start managed, move to dedicated infrastructure, or launch your own chain.</p>
            <div className={classes.modelGrid}>
              {deploymentModels.map((model, i) => (
                <div key={i} className={classes.modelCard}>
                  <h3 className={classes.modelTitle}>{model.title}</h3>
                  <p className={classes.modelIntro}>{model.intro}</p>
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
          <section className={`${classes.section} ${classes.sectionSpaced}`}>
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
            <h2 className={classes.finalCtaTitle}>Launch a pilot chain</h2>
            <p className={classes.finalCtaText}>
              Tell us what you are building. We will help choose the right deployment model.
            </p>
            <div className={classes.finalCtaButtons}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={classes.btnPrimary}>
                Talk to the team
              </a>
              <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className={classes.btnSecondary}>
                Read docs
              </a>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
