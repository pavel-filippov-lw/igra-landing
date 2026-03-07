import { FC } from "react"

import { AboutBenefits, PageLayout } from "~/Components"
import { Flex } from "~/shared/ui"

import tokenDistributionChart from './assets/token-distribution-chart.png'
import classes from './IgraTokenPage.module.scss'

const distributionItems = [
  {
    color: '#F5A623',
    title: 'Team & Advisors (18%)',
    description: '1.8% minted on TGE, 6 months lockup, 36 months vesting',
  },
  {
    color: '#6BD1C3',
    title: 'Ecosystem Development & Grants (22%)',
    description: '2.2% minted on TGE, no lockup, 60 months vesting, phased DAO control',
  },
  {
    color: '#E91E8C',
    title: 'Early Token Sale (10%)',
    description: '1% minted on TGE, 6 months lockup, 18 months vesting',
  },
  {
    color: '#F5A623',
    title: 'Community (25%)',
    description: '2.5% minted on TGE, no lockup, 60 months vesting, phased DAO control',
  },
  {
    color: '#E91E8C',
    title: 'Public Token Sale (5%)',
    description: '0.5% minted on TGE, no lockup, 12 months vesting',
  },
  {
    color: '#6BD1C3',
    title: 'Association (20%)',
    description: '2% minted on TGE, no lockup, 24 months vesting, phased DAO control',
  },
]

const participateSteps = [
  {
    number: '01',
    text: 'Proven Kaspa miners can run attester nodes to secure the network.',
  },
  {
    number: '02',
    text: 'Ecosystem contributors can support development ahead of mainnet.',
  },
  {
    number: '03',
    text: 'Public on-chain distribution planned for Q1 2026 via fair auction mechanism.',
  },
]

export const IgraTokenPage: FC = () => {
  return (
    <PageLayout hideBg>
      <Flex flexDirection='column' gap={40} className={classes.root}>
        <Flex flexDirection='column' gap={30}>
          <div>
            <h1 className={classes.title}>What is $IGRA?</h1>
            <h2 className={classes.subtitle}>KAS for inclusion. $IGRA for execution.</h2>
          </div>
          <p className={classes.description}>
            {'KAS handles sequencing, $IGRA secures execution.'}
            <br /><br />
            <span className={classes.boldText}>$IGRA</span>
            {' secures the Igra Network and governs the protocol. Fixed supply. Demand grows with network usage.'}
            <br />
            {'Fair launch via fair onchain auction mechanism. No hidden actors, no frontrunning, no undisclosed allocations, no random airdrops.'}
          </p>
        </Flex>
        <div className={classes.participateSection}>
          <h3 className={classes.participateTitle}>To participate:</h3>
          <div className={classes.participateCards}>
            {participateSteps.map((step) => (
              <div key={step.number} className={classes.stepCard}>
                <div className={classes.stepNumber}>{step.number}</div>
                <div className={classes.stepText}>{step.text}</div>
              </div>
            ))}
          </div>
          <p className={classes.interested}>
            Interested? <a href="mailto:team@igralabs.com" className={classes.contactLink}>Contact Team</a>
          </p>
        </div>
        <AboutBenefits />
        <div className={classes.tokenDistribution}>
          <h2 className={classes.distributionTitle}>Token distribution</h2>
          <div className={classes.distributionGrid}>
            {distributionItems.map((item, index) => (
              <div key={index} className={classes.distributionItem}>
                <div className={classes.distributionBar} style={{ backgroundColor: item.color }} />
                <div className={classes.distributionContent}>
                  <div className={classes.distributionItemTitle}>{item.title}</div>
                  <div className={classes.distributionItemDesc}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          <img
            src={tokenDistributionChart}
            alt="Token distribution vesting schedule chart"
            className={classes.distributionChart}
          />
        </div>
      </Flex>
    </PageLayout>
  )
}
