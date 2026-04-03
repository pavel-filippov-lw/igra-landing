import { FC } from "react"
import { Link } from "react-router-dom"

import { to } from "~/shared/lib"

import classes from './NewsBanner.module.scss'

export const NewsBanner: FC = () => {
  const handleClick = () => {
    window.plausible?.('NewsBannerClick')
  }

  return (
    <Link to={to.publicAuction('overview')} className={classes.root} onClick={handleClick}>
      <span className={classes.text}>
        Public sale is finished! <strong>Claims from April 10th.</strong>
      </span>
    </Link>
  )
}
