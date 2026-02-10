import { FC } from "react"

import { Flex, Icon } from "~/shared/ui"

import { GlitchText } from "../GlitchText"
import heroVideoSafari from './assets/video.mov'
import heroVideo from './assets/video.webm'
import classes from './Hero.module.scss'

const glitchTextLines = [
  'Agent-native',
  'The fastest',
  'The fairest',
  'The most secure',
  'The only real-time',
]

export const Hero: FC = () => {
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.title}>
          <span style={{ display: 'block' }}>
            <GlitchText
              lines={glitchTextLines}
              className={classes.glitchText}
            />
          </span>
          <span style={{ display: 'block' }}>
            programmable
          </span>
          <span style={{ display: 'block' }}>
            PoW chain
          </span>
        </div>
        <div className={classes.info}>
          <a href="https://x.com/Igra_Labs/status/2019492850459640101" target="_blank" rel="noopener noreferrer" className={classes.readMore}>
            <div className={classes.announcement}>
              <Icon
                name='fire'
                width={28}
                height={36}
                className={classes.icon}
              />
              <div className={classes.content}>
                <span className={classes.date}>5 FEB 2026</span>
                <span className={classes.divider}>|</span>
                <div className={classes.text}>
                  Galleon Test Mainnet is live!
                </div>
                <div className={classes.link}>
                  Read more
                  <Icon
                    name='arrowTopRight'
                    size={10}
                    className={classes.icon}
                  />
                </div>
              </div>
            </div>
          </a>
          <div className={classes.heroButtons}>
            <a
              href="https://igra-labs.gitbook.io/igralabs-docs/quickstart/how-to-setup-a-node"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.buttonLink}
            >
              <Flex alignItems='center' gap={8} className={classes.button}>
                Set up a node
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
            <a
              href="https://igra-labs.gitbook.io/igralabs-docs/quickstart/deploy-your-first-contract"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.buttonLink}
            >
              <Flex alignItems='center' gap={8} className={classes.button}>
                Start building
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeYewS-_fiAe1qW8lqjUcwbt2pLU9_0lRKp3rLnZp9kI2nDuA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.buttonLink}
            >
              <Flex alignItems='center' gap={8} className={classes.button}>
                Become an Attester
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
          </div>
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
