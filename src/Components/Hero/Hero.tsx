import { FC } from "react"


import { GlitchText } from "../GlitchText"
import heroVideoSafari from './assets/video_alpha.mov'
import heroVideo from './assets/video_alpha.webm'
import classes from './Hero.module.scss'

const glitchTextLines = [
  'Agentic-ready',
  'fastest',
  'fairest',
  'most secure',
  'only realtime',
]

export const Hero: FC = () => {
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.title}>
          <span style={{ display: 'block' }}>
            {`The `}
            <GlitchText
              lines={glitchTextLines}
              className={classes.glitchText}
            />
          </span>
          <span style={{ display: 'block' }}>
            {`programmable`}
          </span>
          <span style={{ display: 'block' }}>
            {`PoW chain`}
          </span>
        </div>
        <div className={classes.announcement}>
          <span className={classes.icon}>🔥</span>
          <span className={classes.date}>14 JAN 2026</span>
          <span className={classes.divider}>|</span>
          <span className={classes.text}>
            Galleon closed mainnet is live. <a href="#" className={classes.readMore}>Read more →</a>
          </span>
        </div>
      </div>
      <div className={classes.videoWrapper}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload='auto'
          className={classes.video}
        >
          <source src={heroVideoSafari} type="video/mp4; codecs=&quot;hvc1&quot;" />
          <source src={heroVideo} type="video/webm" />
        </video>
      </div>
    </div>
  )
}
