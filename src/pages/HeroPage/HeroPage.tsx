import { FC } from "react"

import { Hero, HeroBenefits, LatestNews, PageLayout, Roadmap } from "~/Components"
import { Flex, Icon } from "~/shared/ui"

import classes from './HeroPage.module.scss'

export const HeroPage: FC = () => {
  return (
    <PageLayout>
      <Flex
        flexDirection='column'
        gap={100}
        className={classes.root}
      >
        <div className={classes.heroSection}>
          <Hero />
          <Flex
            justifyContent='center'
            alignItems='center'
            className={classes.buttons}
          >
            <a className={classes.buttonLink}>
              <Flex alignItems='center' gap={8} className={classes.button}>
                Setup-up a node
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
            <div className={classes.separator} />
            <a className={classes.buttonLink}>
              <Flex alignItems='center' gap={8} className={classes.button}>
                Apply for a grant
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
            <div className={classes.separator} />
            <a className={classes.buttonLink}>
              <Flex alignItems='center' gap={8} className={classes.button}>
                Become an Attester
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
          </Flex>
        </div>
        <Flex flexDirection='column' gap={100} className={classes.content}>
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
