import { FC, Fragment, useEffect } from "react"

import { to } from "~/shared/lib"

import { Benefit, Card } from "./Card"
import classes from './HeroBenefits.module.scss'

const benefitsList: Benefit[] = [
  {
    iconName: 'stack',
    title: () => (
      <div>
        <span className={classes.boldTitle}>Bitcoin-grade</span>
        <br />
        <span className={classes.boldTitle}>security</span>
      </div>
    ),
    description: () => (
      <>
        {'No sequencer. No validator set. Kaspa\'s PoW secures every transaction. Bitcoin-grade security for smart contracts.'}
      </>
    ),
    to: to.benefits('0'),
  },
  {
    iconName: 'clock',
    title: () => (
      <div>
        <span className={classes.boldTitle}>MEV & censorship</span>
        <br />
        <span className={classes.boldTitle}>resistant</span>
      </div>
    ),
    description: () => (
      <>
        {'Based rollup with no centralized sequencer. MEV resistant and censorship resistant by design.'}
      </>
    ),
    to: to.benefits('1'),
  },
  {
    iconName: 'ethereum',
    title: () => (
      <span className={classes.boldTitle}>EVM-compatible</span>
    ),
    description: () => (
      <>
        {'Full EVM compatibility, 400K+ Solidity devs, no cold start, clear audit frameworks'}
      </>
    ),
    to: to.benefits('6'),
  },
  {
    iconName: 'flag',
    title: () => (
      <span className={classes.boldTitle}>Swiss-governed</span>
    ),
    description: () => (
      <>
        {'Legal entity for accountability, no single operator to subpoena'}
      </>
    ),
    to: to.benefits('5'),
  },
  // Hidden cards for now
  /*
  {
    iconName: 'molecule',
    title: () => (
      <>
        <span className={classes.boldTitle}>Post Quantum</span>
        <br />
        {' Cryptography resilient'}
      </>
    ),
    to: to.benefits('2'),
  },
  {
    iconName: 'blocks',
    title: () => (
      <>
        {'Independent logical '}
        <span className={classes.boldTitle}>zones</span>
      </>
    ),
    to: to.benefits('3'),
  },
  {
    iconName: 'lock',
    title: () => (
      <span className={classes.boldTitle}>Secure Privacy</span>
    ),
    to: to.benefits('4'),
  },
  */
]

export const HeroBenefits: FC = () => {
  // Animation removed - cards now appear immediately
  useEffect(() => {
    // Cleanup for any future animations if needed
  }, [])

  return (
    <div className={classes.root}>
      {benefitsList.map((benefit, index) => (
        <Fragment key={index}>
          <Card
            {...benefit}
            className={classes.card}
          />
        </Fragment>
      ))}
    </div>
  )
}
