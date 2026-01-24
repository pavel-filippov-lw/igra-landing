import { FC } from "react"

import classes from './StackIcon.module.scss'

export interface StackIconProps {
  size?: number | string
}

export const StackIcon: FC<StackIconProps> = ({ size }) => {
  return (
    <div className={classes.root} style={{ width: size, height: size, minWidth: size, minHeight: size }}>
      <div className={classes.container}>
        <div className={classes.rectangle} />
        <div className={classes.rectangle} />
        <div className={classes.rectangle} />
        <div className={classes.rectangle} />
      </div>
    </div>
  )
}
