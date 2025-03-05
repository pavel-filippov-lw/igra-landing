import { FC } from "react"

import { Flex } from "~/shared/ui"

import { HeroBenefits } from "../HeroBenefits"
import { HeroContent } from "../HeroContent"
import cubeVideo from './assets/cube.webm'
import classes from './Hero.module.scss'

export const Hero: FC = () => {
  return (
    <Flex className={classes.root}>
      <div className={classes.leftSide}>
        <HeroContent className={classes.content} />
        <HeroBenefits />
      </div>
      <div
        className={classes.image}
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        className={classes.video}
      >
        {/* <source src={cubeVideoSafari} type="video/mp4; codecs=hevc" /> */}
        <source src={cubeVideo} type="video/webm" />
      </video>
    </Flex>
  )
}
