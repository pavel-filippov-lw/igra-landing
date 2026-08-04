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
        Igra × Tangem wallet giveaway is live! <strong>Check if you're eligible.</strong>
      </span>
    </Link>
  )
}
