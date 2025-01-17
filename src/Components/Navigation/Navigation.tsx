import clsx from "clsx"
import { FC, Fragment } from "react"

import { Flex } from "~/shared/ui"

import classes from './Navigation.module.scss'

const links = [
//  { label: 'Litepaper', to: '' },
  { label: 'Contact', to: 'mailto:team@igra.network' },
]

export interface NavigationProps {
  className: string
}

export const Navigation: FC<NavigationProps> = ({ className }) => {
  return (
    <Flex
      gap={12}
      alignItems='center'
      className={clsx(classes.root, className)}
    >
      {links.map((link, index) => (
        <Fragment key={index}>
          <a href={link.to}>
            <div>
              {link.label}
            </div>
          </a>
          {index !== links.length - 1 && (
            <div className={classes.separator} />
          )}
        </Fragment>
      ))}
    </Flex>
  )
}
