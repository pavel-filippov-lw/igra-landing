import { FC } from "react"

import { HeroBenefits } from "../HeroBenefits"
import { HeroContent } from "../HeroContent"
import classes from './Hero.module.scss'
import heroVideo from './hero.webm'

export const Hero: FC = () => {
  return (
    <div className={classes.root}>
      <HeroContent className={classes.content} />
      <HeroBenefits className={classes.benefits} />
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
