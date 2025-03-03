import clsx from "clsx"
import { FC } from "react"

import { Flex } from "~/shared/ui"

import { HeroBenefits } from "../HeroBenefits"
import { HeroContent } from "../HeroContent"
import cubeVideoSafari from './assets/cube.mov'
import cubeVideo from './assets/cube.webm'
import classes from './Hero.module.scss'

export const Hero: FC = () => {
  const isSafari = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")

  return (
    <Flex className={classes.root}>
      <div className={classes.leftSide}>
        <HeroContent className={classes.content} />
        <HeroBenefits />
      </div>
      <div
        className={clsx(classes.image, {
          [classes.isSafari]: isSafari,
        })}
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        className={clsx(classes.video, {
          [classes.isSafari]: isSafari,
        })}
      >
        <source src={cubeVideo} type="video/webm" />
        <source src={cubeVideoSafari} type="video/mp4; codecs=hevc" />
      </video>
    </Flex>
  )
}
