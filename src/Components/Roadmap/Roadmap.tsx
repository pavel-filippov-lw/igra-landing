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
              justifyContent='space-around'
              alignItems='center'
              className={classes.content}
            >
              <Flex flexDirection='column' alignItems='center' className={clsx(classes.card, classes.highlighted)}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2025 Q1</h5>
                <div className={classes.description}>
                  <b>Dromon:</b> Invite-only devnet with core development infrastructure
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={clsx(classes.card, classes.highlighted)}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2025 Q3</h5>
                <div className={classes.description}>
                  <b>Public Nodes:</b> Caravel Testnet running on community operators hardware
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2026 Jan</h5>
                <div className={classes.description}>
                  <b>Fluyt:</b> Open Mainnet with Attestors and TGE<br/>
                  Audit by Sigma Prime
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2026 Mar</h5>
                <div className={classes.description}>
                  <b>Frigate:</b> Public Open Mainnet
                </div>
              </Flex>
            </Flex>
            <Flex
              justifyContent='space-around'
              alignItems='center'
              className={clsx(classes.content, classes.bottom)}
            >
              <Flex flexDirection='column' alignItems='center' className={clsx(classes.card, classes.bottom, classes.highlighted)}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2025 July</h5>
                <div className={classes.description}>
                  <b>Caravel:</b> Incentivized testnet on Kaspa TN10<br/>
                  Pre-liquid
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={clsx(classes.card, classes.highlighted)}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2026 Jan</h5>
                <div className={classes.description}>
                  <b>Galleon:</b> Closed Mainnet run by community node operators
                </div>
              </Flex>
              <Flex flexDirection='column' alignItems='center' className={classes.card}>
                <div className={classes.dot} />
                <div className={classes.stick} />
                <h5 className={classes.title}>2026 Feb</h5>
                <div className={classes.description}>
                  <b>Brigantine:</b> Whitelisted Mainnet with core DeFi
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
