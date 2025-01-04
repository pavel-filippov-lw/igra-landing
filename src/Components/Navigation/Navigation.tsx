import { FC, Fragment } from "react"

import { Flex } from "~/shared/ui"

import classes from './Navigation.module.scss'

const links = [
  { label: 'Litepaper', to: '' },
  { label: 'Contact', to: '' },
]

export const Navigation: FC = () => {
  return (
    <Flex
      gap={12}
      alignItems='center'
      className={classes.root}
    >
      {links.map((link, index) => (
        <Fragment key={index}>
          <div>
            {link.label}
          </div>
          {index !== links.length - 1 && (
            <div className={classes.separator} />
          )}
        </Fragment>
      ))}
    </Flex>
  )
}
