import { FC } from "react"

import { Button, Flex, Icon } from "~/shared/ui"

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
        <Flex alignItems='center' gap={20} flexWrap='wrap'>
          <Icon name='cube_5' size={40} />
          <div className={classes.testnetText}>
            Caravel testnet launch underway!
          </div>
          <a
            href="https://x.com/igra_labs/status/1946279111346819436?s=46&t=orsNfFppjKLweCyxLsiajQ"
            target='_blank'
            rel='noreferrer'
          >
            <Button variant='gold'>
              <Flex gap={8} alignItems='center'>
                {/* <Icon name='cube_2' size={16} /> */}
                Learn more
              </Flex>
            </Button>
          </a>
        </Flex>
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
