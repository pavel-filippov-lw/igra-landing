import clsx from "clsx"
import { forwardRef, ReactNode } from "react"
import { useNavigate } from "react-router-dom"

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
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  iconName,
  title,
  description,
  to,
  className,
  showBorder = false,
  ...props
}, ref) => {
  const navigate = useNavigate()

  return (
    <Flex
      ref={ref}
      flexDirection='column'
      alignItems='center'
      {...props}
      className={clsx(classes.root, className)}
    >
      <Flex
        flexDirection='column'
        alignItems='center'
        gap={20}
        className={clsx(classes.content, showBorder && classes.withBorder)}
      >
        <Icon
          name={iconName}
          size={60}
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
