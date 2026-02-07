import clsx from "clsx"
import { FC } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { PageLayout } from "~/Components"
import { to } from "~/shared/lib"
import { Icon } from "~/shared/ui"

import classes from './BenefitsPage2.module.scss'

const benefitsList = [
  {
    iconName: 'stack',
    iconLabel: 'Bitcoin-grade security',
    title: () => 'Bitcoin-grade security',
    description: () => (
      <>
        No sequencer. No validator set. Kaspa's PoW secures every transaction. Bitcoin-grade security for smart contracts.
      </>
    ),
  },
  {
    iconName: 'clock',
    iconLabel: 'MEV & censorship resistant',
    title: () => 'MEV & censorship resistant',
    description: () => (
      <>
        Based rollup with no centralized sequencer. MEV resistant and censorship resistant by design.
      </>
    ),
  },
  {
    iconName: 'ethereum',
    iconLabel: 'EVM-compatible',
    title: () => 'EVM-compatible',
    description: () => (
      <>
        Full EVM compatibility. 400K+ Solidity devs, no cold start, clear audit frameworks.
      </>
    ),
  },
  {
    iconName: 'flag',
    iconLabel: 'Swiss-governed',
    title: () => 'Swiss-governed',
    description: () => (
      <>
        Legal entity for accountability, no single operator to subpoena.
      </>
    ),
  },
  {
    iconName: 'infinity',
    iconLabel: 'Decentralization',
    title: () => 'True decentralization',
    description: () => (
      <>
        Inherits Kaspa's globally distributed network of thousands of independent miners. No central points of control or failure.
      </>
    ),
  },
  {
    iconName: 'molecule',
    iconLabel: 'Quantum Safe',
    title: () => 'Post Quantum Cryptography',
    description: () => (
      <>
        Future-proof security with quantum-resistant cryptography. Your assets remain secure even as quantum computing advances.
      </>
    ),
  },
]

export const BenefitsPage2: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const benefitId = searchParams.get('benefitId')
  const benefit = benefitsList.find((_, index) => index.toString() === benefitId) ?? benefitsList[0]

  const handleNavigation = (index: number) => {
    navigate(to.benefits2(index.toString()))
  }

  return (
    <PageLayout>
      <div className={classes.root}>
        <h1 className={classes.pageTitle}>What is Igra</h1>

        <div className={classes.tabsContainer}>
          <div className={classes.tabsRow}>
            {benefitsList.map((item, index) => (
              <div
                key={index}
                className={clsx(classes.tab, {
                  [classes.active]: index.toString() === (benefitId ?? '0'),
                })}
                onClick={() => handleNavigation(index)}
              >
                <Icon
                  name={item.iconName}
                  size={40}
                  className={classes.tabIcon}
                />
                <span className={classes.tabLabel}>{item.iconLabel}</span>
              </div>
            ))}
          </div>
          <div className={classes.tabIndicator} />
        </div>

        <div className={classes.contentSection}>
          <h2 className={classes.title}>{benefit.title()}</h2>
          <div className={classes.description}>
            {benefit.description?.()}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}