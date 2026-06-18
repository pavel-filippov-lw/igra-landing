import { FC } from "react"
import { Link } from "react-router-dom"

import { to } from "~/shared/lib"
import { Flex, Icon } from "~/shared/ui"

import heroVideoSafari from './assets/bg1.mov'
import heroVideo from './assets/bg1.webm'
import classes from './Hero.module.scss'

export const Hero: FC = () => {
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <h1 className={classes.title}>
          FINANCE INFRASTRUCTURE THAT CANNOT BE OVERRIDDEN
        </h1>
        <div className={classes.info}>
          <a href="https://luma.com/q8zh39zs" target="_blank" rel="noopener noreferrer" className={classes.readMore}>
            <div className={classes.announcement}>
              <Icon
                name='fire'
                width={28}
                height={36}
                className={classes.icon}
              />
              <div className={classes.content}>
                <span className={classes.date}>12 JUN 2026</span>
                <span className={classes.divider}>|</span>
                <div className={classes.text}>
                  Registration open for Kaspa x Igra Berlin Blockchain Week event
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
              href="https://explorer.igralabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.buttonLink}
            >
              <Flex alignItems='center' gap={8} className={classes.button}>
                Open Igra Explorer
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
            <Link to={to.nodes()} className={classes.buttonLink}>
              <Flex alignItems='center' gap={8} className={classes.button}>
                Igra Nodes Live
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </Link>
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
