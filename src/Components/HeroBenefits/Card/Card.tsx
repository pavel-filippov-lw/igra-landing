import clsx from "clsx"
import { forwardRef, ReactNode } from "react"
import { useNavigate } from "react-router-dom"

import { Flex, FlexProps, Icon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

import classes from './Card.module.scss'

export interface Benefit {
  iconName: IconName
  iconLabel?: string
  title: () => ReactNode
  description?: () => ReactNode
  to: string
}

export interface CardProps extends Benefit, FlexProps {
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  iconName,
  iconLabel,
  title,
  description,
  to,
  className,
  ...props
}, ref) => {
  const navigate = useNavigate()

  return (
    <Flex
      ref={ref}
      flexDirection='column'
      alignItems='center'
      gap={12}
      {...props}
      className={clsx(classes.root, className)}
    >
      <Flex
        flexDirection='column'
        alignItems='center'
        gap={8}
      >
        <Icon
          name={iconName}
          size={85}
          className={classes.icon}
        />
        {iconLabel && (
          <div className={classes.iconLabel}>
            {iconLabel}
          </div>
        )}
      </Flex>
      <Flex
        flexDirection='column'
        gap={10}
        className={classes.content}
      >
        <div className={classes.title}>
          {title()}
        </div>
        {description && (
          <div className={classes.description}>
            {description()}
          </div>
        )}
        <div
          className={classes.link}
          onClick={() => {
            document.getElementById('root')?.scrollTo({
              top: 0,
              behavior: 'instant',
            })
            navigate(to)
          }}
        >
          <Icon name='arrowTopRight' size={12} />
        </div>
      </Flex>
    </Flex>
  )
})
