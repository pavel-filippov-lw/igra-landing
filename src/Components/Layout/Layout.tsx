import { FC, PropsWithChildren } from "react"

import classes from './Layout.module.scss'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classes.root}>
      {children}
      <div className={classes.copyright}>
        &copy; 2024-2025 Igra Labs
      </div>
    </div>
  )
}
