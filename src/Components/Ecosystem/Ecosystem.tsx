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
            Ecosystem
          </h1>
          <div className={classes.description}>
            These early adopters are testing our devnet and developing the applications that will shape Igra Network future.
            <a
              href='#'
              target='_blank'
              rel='noreferrer'
              className={classes.link}
            >
              Learn more
            </a>
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
