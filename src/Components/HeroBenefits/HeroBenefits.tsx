import gsap from "gsap"
import { FC, Fragment, useEffect, useRef } from "react"

import { Flex } from "~/shared/ui"

import { Benefit, Card } from "./Card"
import { DescriptionLabel } from "./DescriptionLabel"
import classes from './HeroBenefits.module.scss'

const nextGenBenefits: Benefit[] = [
  {
    icon: {
      name: 'lightning',
      width: 37,
      height: 56,
    },
    title: 'Realtime on-chain apps',
    description: 'Scalable 5,000 TPS with sub-second finality',
  },
  {
    icon: {
      name: 'lock',
      width: 36,
      height: 49,
    },
    title: 'Protected by Bitcoin-grade security',
    description: 'Validity of Igra state is secured by 1.1 Exahash',
  },
  {
    icon: {
      name: 'synchronous',
      width: 91,
      height: 66,
    },
    title: 'Synchronous atomically composable',
    description: 'Any amount of contracts can be composed in one atomic call',
  },
  {
    icon: {
      name: 'taxTheft',
      width: 56,
      height: 56,
    },
    title: 'MEV resilient',
    description: 'Preventing exploitative behaviors and oracle manipulation',
  },
  {
    icon: {
      name: 'zkChains',
      width: 146,
      height: 44,
    },
    title: 'Interoperable L2',
    description: 'Create dApps with assets that settles across various ZK chains',
  },
]

const unlocksDeFiBenefits: Benefit[] = [
  {
    icon: {
      name: 'parachute',
      width: 56,
      height: 56,
    },
    description: (
      <DescriptionLabel title='Risk Engines '>
        onchain risk calculators analyse transactions and trigger mitigating actions in a single transaction before a new state change
      </DescriptionLabel>
    ),
  },
  {
    icon: {
      name: 'dex',
      width: 61,
      height: 61,
    },
    description: (
      <DescriptionLabel title='On-chain DEX '>
        atomic composability makes on-chain orderbooks possible so that AMMs can live within a single transaction
      </DescriptionLabel>
    ),
  },
  {
    icon: {
      name: 'infinity',
      width: 61,
      height: 26,
    },
    description: (
      <DescriptionLabel title='Atomic Perpetual Market '>
        On-chain orderbooks enable on-chain perpetuals combining transparency and efficiency
      </DescriptionLabel>
    ),
  },
  {
    icon: {
      name: 'stablecoin',
      width: 53,
      height: 52,
    },
    description: (
      <DescriptionLabel title='Stablecoins '>
        based on the Ethena model, collateralized by Kaspa perps that don’t need to rely on liquidity
        to maintain a cheap delta hedge strategy for the collateral
      </DescriptionLabel>
    ),
  },
]

export const HeroBenefits: FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        })
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    })

    cardRefs.current.forEach(card => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Flex
      flexDirection='column'
      gap={160}
      className={classes.root}
    >
      <Flex
        flexDirection='column'
        alignItems='center'
        gap={40}
      >
        <h3 className={classes.title}>
          Igra will unlock next generation of dApps and protocols
        </h3>
        <Flex
          justifyContent='center'
          gap={40}
          flexWrap='wrap'
          className={classes.nextGen}
        >
          {nextGenBenefits.map((benefit, index) => (
            <Fragment key={index}>
              <Card
                ref={(el) => cardRefs.current.push(el)}
                {...benefit}
                className={classes.card}
              />
            </Fragment>
          ))}
        </Flex>
      </Flex>
      <Flex
        flexDirection='column'
        alignItems='center'
        gap={40}
      >
        <Flex
          flexDirection='column'
          alignItems='center'
        >
          <h3 className={classes.title}>
            Atomic Synchronous Composability
          </h3>
          <div className={classes.composability}>
            The ability to execute multiple operations across separate smart contracts in a single transaction,
            without the risk of a partial failure
          </div>
        </Flex>
        <h3 className={classes.title}>
          Unlocks DeFi Apps that were impossible till now
        </h3>
        <div className={classes.unlocksDeFi}>
          {unlocksDeFiBenefits.map((benefit, index) => (
            <Fragment key={index}>
              <Card
                ref={(el) => cardRefs.current.push(el)}
                {...benefit}
                className={classes.card}
              />
            </Fragment>
          ))}
        </div>
      </Flex>
    </Flex>
  )
}
