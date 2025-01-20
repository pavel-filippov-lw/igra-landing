import clsx from "clsx"
import { FC } from "react"

import { Flex } from "~/shared/ui"

import { HeroBenefits } from "../HeroBenefits"
import { HeroContent } from "../HeroContent"
import heroImage from './assets/hero.png'
import heroVideo from './assets/hero.webm'
import classes from './Hero.module.scss'

export const Hero: FC = () => {
  const isSafari = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")

  return (
    <div className={classes.root}>
      <Flex className={classes.layout}>
        <div className={classes.leftSide}>
          <HeroContent className={classes.content} />
          <HeroBenefits />
        </div>
        <div
          style={{ background: `center / contain no-repeat url(${heroImage})` }}
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
          <source src={heroVideo} type="video/webm" />
        </video>
      </Flex>
    </div>
  )
}
