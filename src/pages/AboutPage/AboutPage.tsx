import { FC } from "react"

import { AboutBenefits, PageLayout } from "~/Components"
import { Flex } from "~/shared/ui"

import classes from './AboutPage.module.scss'

export const AboutPage: FC = () => {
  return (
    <PageLayout>
      <Flex flexDirection='column' gap={45} className={classes.root}>
        <div>
          <h1 className={classes.title}>What is IGRA?</h1>
          <h2 className={classes.subtitle}>KAS for inclusion. IGRA for execution.</h2>
        </div>
        <p className={classes.description}>
          <span className={classes.boldText}>IGRA</span>
          {' secures the Igra Network and governs the protocol. Fixed supply. Demand grows with network usage.'}
          <br />
          {'Fair launch via '}
          <span className={classes.boldText}>Uniswap CCA</span>
          {' - a publicly auditable, onchain auction mechanism. No hidden actors, no frontrunning, no hidden allocations, no random airdrops.'}
        </p>
        <AboutBenefits />
      </Flex>
    </PageLayout>
  )
}
