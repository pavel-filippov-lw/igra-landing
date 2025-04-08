import { FC } from "react"

import { Button, Flex } from "~/shared/ui"

import { CubeSection } from "../CubeSection"
import { Difficulty } from "../Difficulty"
import { MorphText } from "../MorphText"
import classes from './Hero.module.scss'

const descriptionLines = [
  'A chain for builders who want to build without limitations',
  'A chain where applications can run seamlessly across different chains',
  'A chain that is fast enough to avoid MEV headaches',
  'A chain that’s as secure as Bitcoin',
  'A chain that unleashes endless new possibilities for composable smart contracts',
  'A chain that lets builders manage risk in real time',
]

export const Hero: FC = () => {
  return (
    <CubeSection className={classes.root}>
      <Flex
        flexDirection='column'
        gap={24}
        className={classes.content}
      >
        <h1 className={classes.title}>
          Defy DeFi limitations
        </h1>
        <h2 className={classes.subtitle}>
          Atomic programmability on a based rollup leveraging Kaspa BlockDAG.
        </h2>
        <MorphText
          lines={descriptionLines}
          className={classes.description}
        />
      </Flex>
      <Flex
        gap={16}
        className={classes.buttons}
      >
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeASfHT6R398RivDiM7qgtYDiih1rYk4b4kDOskyLeiXWRsuw/viewform">
        <Button>
          Build on IGRA
        </Button>
        </a>
        <a href="https://docs.igralabs.com/">
        <Button variant='secondary'>
          Documentation
        </Button>
        </a>
      </Flex>
      <Difficulty />
    </CubeSection>
  )
}
