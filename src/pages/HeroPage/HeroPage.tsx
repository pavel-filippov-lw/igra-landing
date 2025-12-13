import gsap from "gsap"
import { FC, useEffect, useRef } from "react"

import { Hero, HeroBenefits, HeroCodeCard, PageLayout, TransactionSpeedCard } from "~/Components"
import { Button, Flex } from "~/shared/ui"

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
        <Hero />
        <Flex
          gap={30}
          justifyContent='space-between'
          className={classes.buttons}
        >
          <Button variant='tertiary' className={classes.button}>
            Setup-up a node
          </Button>
          <Button variant='tertiary' className={classes.button}>
            Apply for a grant
          </Button>
          <Button variant='tertiary' className={classes.button}>
            Become an Attester
          </Button>
        </Flex>
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
      </Flex>
    </PageLayout>
  )
}
