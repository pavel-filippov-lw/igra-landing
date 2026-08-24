import { FC } from "react"
import { Link } from "react-router-dom"

import { to } from "~/shared/lib"

import classes from './NewsBanner.module.scss'

export const NewsBanner: FC = () => {
  const handleClick = () => {
    window.plausible?.('TangemGiveawayBannerClick')
  }

  return (
    <Link to={to.tangemClaim()} className={classes.root} onClick={handleClick}>
      <span className={classes.text}>
        Igra × Tangem giveaway — winners announced! <strong>Connect your wallet to claim.</strong>
      </span>
    </Link>
  )
}
