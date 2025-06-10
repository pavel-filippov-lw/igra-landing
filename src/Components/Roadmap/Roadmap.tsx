import clsx from "clsx"
import { FC } from "react"

import { Flex } from "~/shared/ui"

import classes from './Roadmap.module.scss'

export const Roadmap: FC = () => {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      gap={80}
      className={classes.root}
    >
      <h3 className={classes.title}>Roadmap</h3>
      <div className={classes.positioner}>
        <div className={classes.wrapper}>
          <div className={classes.roadmap}>
            <Flex
              justifyContent='space-between'
              alignItems='center'
              gap={30}
              className={classes.content}
            >
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2025 Q1</h5>
                <div className={classes.description}>
                  <b>Dromon:</b> Invite-only devnet with core development infrastructure
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2025 Q3</h5>
                <div className={classes.description}>
                  <b>Carrack:</b> Incentivized mainnet<br/>Token launch
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2026 Q1</h5>
                <div className={classes.description}>
                  Testnet with ZKVM support, canonical exit bridge
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2027</h5>
                <div className={classes.description}>
                  VM-agnostic, scalable sync atomic composability
                </div>
              </Flex>
            </Flex>
            <Flex
              justifyContent='space-between'
              alignItems='center'
              gap={30}
              className={clsx(classes.content, classes.bottom)}
            >
              <Flex flexDirection='column' alignItems='center' className={clsx(classes.card, classes.bottom)}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2025 July</h5>
                <div className={classes.description}>
                  <b>Caravel:</b> Incentivized testnet on Kaspa TN10<br/>
                  Pre-liquid token<br/>
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2025 Q4</h5>
                <div className={classes.description}>
                  <b>Galleon:</b> Mainnet up to 3,000 TPS, core DeFi infrastructure
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2026 Q2</h5>
                <div className={classes.description}>
                  Mainnet with ZKVM support
                </div>
              </Flex>
            </Flex>
          </div>
        </div>
        <div className={classes.bg} />
      </div>
    </Flex>
  )
}
