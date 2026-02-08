import { FC } from "react"

import { Hero, HeroBenefits, LatestNews, PageLayout, Roadmap } from "~/Components"
import { Flex } from "~/shared/ui"

import classes from './HeroPage.module.scss'

export const HeroPage: FC = () => {
  return (
    <PageLayout>
      <Flex
        flexDirection='column'
        className={classes.root}
      >
        <Hero />
        <Flex flexDirection='column' className={classes.content}>
          <HeroBenefits />
          {/* <Flex gap={40} className={classes.cards}>
            <TransactionSpeedCard
              ref={setRef(0)}
              value={30}
              isLoading={false}
              className={classes.transactionSpeedCard}
            />
            <HeroCodeCard
              ref={setRef(1)}
              className={classes.heroCodeCard}
            />
          </Flex> */}
          <LatestNews />
          <Roadmap />
        </Flex>
      </Flex>
    </PageLayout>
  )
}
