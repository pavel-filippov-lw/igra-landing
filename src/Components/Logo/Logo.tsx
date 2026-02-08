import clsx from "clsx"
import { FC } from "react"

import logo from './assets/logo.png'
import classes from './Logo.module.scss'

export interface LogoProps {
  onClick?: () => void
}

export const Logo: FC<LogoProps> = ({ onClick }) => {
  return (
    <div
      className={clsx(classes.root, {
        [classes.isClickable]: !!onClick,
      })}
      style={{
        flexShrink: 0,
        width: 104,
        height: 33,
        background: `center / contain no-repeat url(${logo})`,
      }}
      onClick={onClick}
    />
  )
}
