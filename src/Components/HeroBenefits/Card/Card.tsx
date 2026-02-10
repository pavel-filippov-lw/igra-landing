import clsx from "clsx"
import { forwardRef, ReactNode } from "react"

import { Flex, FlexProps, Icon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

import classes from './Card.module.scss'

export interface Benefit {
  iconName: IconName
  title: () => ReactNode
  description?: () => ReactNode
  to: string
}

export interface CardProps extends Benefit, FlexProps {
  className?: string
  showBorder?: boolean
  disableLink?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  iconName,
  title,
  description,
  to,
  className,
  showBorder = false,
  disableLink = false,
  ...props
}, ref) => {
  const hasLink = !!to && !disableLink
  const isExternal = hasLink && to.startsWith('http')
  const handleClick = hasLink
    ? isExternal
      ? () => window.open(to, '_blank', 'noopener,noreferrer')
      : () => { window.location.href = to }
    : undefined

  return (
    <Flex
      ref={ref}
      flexDirection='column'
      alignItems='center'
      {...props}
      className={clsx(classes.root, className)}
      onClick={handleClick}
    >
      <Flex
        flexDirection='column'
        alignItems='center'
        className={clsx(classes.content, showBorder && classes.withBorder, hasLink && classes.clickable)}
      >
        <Icon
          name={iconName}
          size={96}
          className={classes.icon}
        />
        <div className={classes.title}>
          {title()}
        </div>
        {description && (
          <div className={classes.description}>
            {description()}
          </div>
        )}
        {hasLink && (
          <div className={classes.link}>
            <Icon name='arrowTopRight' size={12} />
          </div>
        )}
      </Flex>
    </Flex>
  )
})
