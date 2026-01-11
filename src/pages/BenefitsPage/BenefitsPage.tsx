import clsx from "clsx"
import { FC } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { PageLayout } from "~/Components"
import { Benefit } from "~/Components/HeroBenefits/Card"
import { to } from "~/shared/lib"
import { AnimatedIcon, Icon } from "~/shared/ui"

import classes from './BenefitsPage.module.scss'

const benefitsList: Benefit[] = [
  {
    iconName: 'stack',
    title: () => 'Bitcoin-grade security',
    description: () => (
      <>
        <span className={classes.boldText}>Igra settles entirely on Kaspa — the second-largest PoW network after Bitcoin.</span>
        <br />
        <br />
        {'Security isn\'t bootstrapped from scratch with a new token or delegated to a rotating committee. It\'s inherited directly from over 1 exahash of mining power with real electricity costs. No validator set to bribe. No stake to accumulate for a governance attack. No slashing conditions to game. The same security model that has protected Bitcoin for 15 years now protects programmable applications. Every smart contract on Igra is backed by the full weight of Kaspa\'s hashrate from block one — not a promise to decentralize later.'}
      </>
    ),
    to: to.benefits('0'),
  },
  {
    iconName: 'clock',
    title: () => 'MEV and censorship resistant',
    description: () => 'Security isn\'t bootstrapped from scratch with a new token or delegated to a rotating committee. It\'s inherited directly from over 1 exahash of mining power with real electricity costs. No validator set to bribe. No stake to accumulate for a governance attack. No slashing conditions to game. The same security model that has protected Bitcoin for 15 years now protects programmable applications. Every smart contract on Igra is backed by the full weight of Kaspa\'s hashrate from block one — not a promise to decentralize later.',
    to: to.benefits('1'),
  },
  {
    iconName: 'molecule',
    title: () => 'Post Quantum Cryptography resilient',
    to: to.benefits('2'),
  },
  {
    iconName: 'blocks',
    title: () => 'Independent logical zones',
    to: to.benefits('3'),
  },
  {
    iconName: 'lock',
    title: () => 'Secure privacy',
    to: to.benefits('4'),
  },
  {
    iconName: 'flag',
    title: () => 'Swiss registered company',
    to: to.benefits('5'),
  },
]

export const BenefitsPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const benefitId = searchParams.get('benefitId')
  const benefit = benefitsList.find((_, index) => index.toString() === benefitId) ?? benefitsList[0]

  const handleNavigation = (index: number) => {
    document.getElementById('benefits-content')?.scrollTo({
      top: 0,
      behavior: 'instant',
    })
    navigate(to.benefits(index.toString()))
  }

  return (
    <PageLayout>
      <div className={classes.root}>
        <AnimatedIcon size={300} variant={benefit.iconName} />
        <div className={classes.card}>
          <div id='benefits-content' className={classes.content}>
            <div className={classes.title}>{benefit.title()}</div>
            <div className={classes.description}>
              {benefit.description?.()}
            </div>
          </div>
          <div className={classes.navigation}>
            {benefitsList.map((benefit, index) => (
              <div key={index} className={classes.item} onClick={() => handleNavigation(index)}>
                <Icon
                  name={benefit.iconName}
                  size={75}
                  className={clsx(classes.icon, {
                    [classes.inactive]: index.toString() !== benefitId,
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
