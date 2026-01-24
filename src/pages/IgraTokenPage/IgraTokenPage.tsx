import { FC } from "react"

import { AboutBenefits, PageLayout } from "~/Components"
import { Flex } from "~/shared/ui"

import classes from './IgraTokenPage.module.scss'

export const IgraTokenPage: FC = () => {
  return (
    <PageLayout>
      <Flex flexDirection='column' gap={80} className={classes.root}>
        <Flex flexDirection='column' gap={30}>
          <div>
            <h1 className={classes.title}>What is $IGRA?</h1>
            <h2 className={classes.subtitle}>KAS for inclusion. $IGRA for execution.</h2>
          </div>
          <p className={classes.description}>
            <span className={classes.boldText}>$IGRA</span>
            {' secures the Igra Network and governs the protocol. Fixed supply. Demand grows with network usage.'}
            <br />
            {'Fair launch via '}
            <span className={classes.boldText}>Uniswap CCA</span>
            {' - a publicly auditable, onchain auction mechanism. No hidden actors, no frontrunning, no hidden allocations, no random airdrops.'}
          </p>
        </Flex>
        <div className={classes.participateSection}>
          <h3 className={classes.participateTitle}>To participate:</h3>
          <ul className={classes.participateList}>
            <li>Proven Kaspa miners can run attester nodes to secure the network.</li>
            <li>Ecosystem contributors can support development ahead of mainnet.</li>
            <li>Public on-chain distribution planned for Q1 2026 via fair auction mechanism.</li>
          </ul>
          <p className={classes.interested}>
            Interested? <a href="mailto:team@igra.xyz" className={classes.contactLink}>Contact Team</a>
          </p>
        </div>
        <AboutBenefits />
      </Flex>
    </PageLayout>
  )
}
