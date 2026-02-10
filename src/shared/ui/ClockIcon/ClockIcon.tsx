import { FC } from "react"

import classes from './ClockIcon.module.scss'

export interface ClockIconProps {
  size?: number | string
}

export const ClockIcon: FC<ClockIconProps> = ({ size }) => {
  return (
    <div className={classes.root} style={{ width: size, height: size, minWidth: size, minHeight: size }}>
      <div className={classes.container}>
        <div className={classes.outer} />
        <div className={classes.innerContainer}>
          <div className={classes.inner} />
          <div className={classes.oval} />
        </div>
      </div>
    </div>
  )
}
