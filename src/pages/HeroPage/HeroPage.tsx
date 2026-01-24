import gsap from "gsap"
import { FC, useEffect, useRef } from "react"

import { Hero, HeroBenefits, HeroCodeCard, PageLayout, Roadmap, TransactionSpeedCard } from "~/Components"
import { Flex, Icon } from "~/shared/ui"

import classes from './HeroPage.module.scss'

export const HeroPage: FC = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el
  }

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 1 + index * 0.5,
          ease: 'power3.out',
        })
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    })

    refs.current.forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <PageLayout>
      <Flex
        flexDirection='column'
        gap={100}
        className={classes.root}
      >
        <div className={classes.heroSection}>
          <Hero />
          <Flex
            justifyContent='center'
            alignItems='center'
            className={classes.buttons}
          >
            <a className={classes.buttonLink}>
              <Flex alignItems='center' gap={8} className={classes.button}>
                Setup-up a node
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
            <div className={classes.separator} />
            <a className={classes.buttonLink}>
              <Flex alignItems='center' gap={8} className={classes.button}>
                Apply for a grant
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
            <div className={classes.separator} />
            <a className={classes.buttonLink}>
              <Flex alignItems='center' gap={8} className={classes.button}>
                Become an Attester
                <Icon name='arrowTopRight' size={10} />
              </Flex>
            </a>
          </Flex>
        </div>
        <Flex flexDirection='column' gap={100} className={classes.content}>
          <HeroBenefits />
          <Flex gap={40} className={classes.cards}>
            <TransactionSpeedCard
              ref={setRef(0)}
              value={30}
              isLoading={false}
              className={classes.transactionSpeedCard}
            />
            <HeroCodeCard
              ref={setRef(1)}
              className={classes.heroCodeCard}
            />
          </Flex>
          <Roadmap />
        </Flex>
      </Flex>
    </PageLayout>
  )
}
