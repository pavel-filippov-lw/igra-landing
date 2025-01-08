import { FC } from "react"

import { HeroBenefits } from "../HeroBenefits"
import { HeroContent } from "../HeroContent"
import heroVideo from './assets/hero.webm'
import classes from './Hero.module.scss'

export const Hero: FC = () => {
  return (
    <div className={classes.root}>
      <HeroContent className={classes.content} />
      <HeroBenefits />
      <video
        autoPlay
        muted
        loop
        className={classes.video}
      >
        <source src={heroVideo} type="video/webm" />
      </video>
    </div>
  )
}
