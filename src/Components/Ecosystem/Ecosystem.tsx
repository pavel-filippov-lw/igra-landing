import { FC } from "react"

import { Flex } from "~/shared/ui"

import { CubeSection } from "../CubeSection"
import { ProjectsList } from "../ProjectsList"
import classes from './Ecosystem.module.scss'

export const Ecosystem: FC = () => {
  return (
    <Flex
      flexDirection='column'
    >
      <CubeSection className={classes.root}>
        <Flex
          flexDirection='column'
          gap={24}
          className={classes.content}
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
      </CubeSection>
      <ProjectsList />
    </Flex>
  )
}
