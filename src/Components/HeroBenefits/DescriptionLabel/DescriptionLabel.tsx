import { FC, PropsWithChildren } from "react"

import classes from './DescriptionLabel.module.scss'

export interface DescriptionLabelProps extends PropsWithChildren {
  title: string
}

export const DescriptionLabel: FC<DescriptionLabelProps> = ({ title, children }) => {
  return (
    <>
      <span className={classes.title}>{title}</span>
      {children}
    </>
  )
}
