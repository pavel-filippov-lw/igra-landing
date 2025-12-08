import { FC } from "react"

import { Hero, HeroBenefits, HeroCodeCard, PageLayout, TransactionSpeedCard } from "~/Components"
import { Button, Flex } from "~/shared/ui"

import classes from './HeroPage.module.scss'

export const HeroPage: FC = () => {
  return (
    <PageLayout>
      <Flex
        flexDirection='column'
        gap={100}
        className={classes.root}
      >
        <Hero />
        <Flex
          gap={30}
          justifyContent='space-between'
          className={classes.buttons}
        >
          <Button variant='tertiary' className={classes.button}>
            Setup-up a node
          </Button>
          <Button variant='tertiary' className={classes.button}>
            Apply for a grant
          </Button>
          <Button variant='tertiary' className={classes.button}>
            Become an Attester
          </Button>
        </Flex>
        <HeroBenefits />
        <Flex gap={40} className={classes.cards}>
          <TransactionSpeedCard value={30} isLoading={false} className={classes.transactionSpeedCard} />
          <HeroCodeCard className={classes.heroCodeCard} />
        </Flex>
      </Flex>
    </PageLayout>
  )
}
