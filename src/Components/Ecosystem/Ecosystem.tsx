import { FC } from "react"

import { Button, Flex } from "~/shared/ui"

import { CubeSection } from "../CubeSection"
import { ProjectsList } from "../ProjectsList"
import classes from './Ecosystem.module.scss'

export const Ecosystem: FC = () => {
  return (
    <Flex
      flexDirection='column'
      gap={45}
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
          <Flex
            gap={26}
            flexDirection='column'
            className={classes.description}
          >
            <div>
              These early adopters are testing our devnet and developing the applications that will shape Igra Network future.
            </div>
            <div>
              Are you building something exciting? Connect with our team to explore how Igra Network can power your project:
            </div>
          </Flex>
          <Button>
            Apply Now
          </Button>
        </Flex>
      </CubeSection>
      <ProjectsList />
    </Flex>
  )
}
