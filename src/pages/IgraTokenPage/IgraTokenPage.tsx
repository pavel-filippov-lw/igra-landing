import { FC } from "react"

import { AboutBenefits, PageLayout } from "~/Components"
import { Flex } from "~/shared/ui"

import classes from './IgraTokenPage.module.scss'

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
      </Flex>
    </PageLayout>
  )
}
