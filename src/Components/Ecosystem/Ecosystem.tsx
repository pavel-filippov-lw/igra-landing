import { FC } from "react"

import { Flex } from "~/shared/ui"

import { ProjectsList } from "../ProjectsList"
import classes from './Ecosystem.module.scss'

export const Ecosystem: FC = () => {
  return (
    <Flex
      flexDirection='column'
      gap={65}
      className={classes.root}
    >
      <Flex className={classes.content}>
        <Flex
          flexDirection='column'
          gap={24}
          className={classes.leftSide}
        >
          <h1 className={classes.title}>
            Igra Fleet
          </h1>
          <div className={classes.description}>
            These vetted teams are already building real projects on Igra — from DeFi protocols to infrastructure tools. They’re shaping the future of Kaspa’s programmable layer. Join our ecosystem to build, collaborate, and shape the next wave of applications together.
            <br/>
            <a
              href='mailto:team@igralabs.com'
              target='_blank'
              rel='noreferrer'
              className={classes.link}
            >Join the Fleet</a>
          </div>
        </Flex>
        <div className={classes.images}>
          <div className={classes.image} />
          <div className={classes.bg} />
        </div>
      </Flex>
      <ProjectsList />
    </Flex>
  )
}
