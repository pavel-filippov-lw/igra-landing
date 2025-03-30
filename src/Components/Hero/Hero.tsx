import { FC } from "react"

import { Button, Flex } from "~/shared/ui"

import { Difficulty } from "../Difficulty"
import { HeroContent } from "../HeroContent"
import cubeVideoSafari from './assets/cube.mov'
import cubeVideo from './assets/cube.webm'
import classes from './Hero.module.scss'

export const Hero: FC = () => {
  return (
    <Flex className={classes.root}>
      <div className={classes.leftSide}>
        <HeroContent
          className={classes.content}
        />
        <Flex
          gap={16}
          className={classes.buttons}
        >
          <Button>
            Build on IGRA
          </Button>
          <Button variant='secondary'>
            Documentation
          </Button>
        </Flex>
        <Difficulty />
      </div>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        className={classes.video}
      >
        <source src={cubeVideoSafari} type="video/mp4; codecs=&quot;hvc1&quot;" />
        <source src={cubeVideo} type="video/webm" />
      </video>
    </Flex>
  )
}
