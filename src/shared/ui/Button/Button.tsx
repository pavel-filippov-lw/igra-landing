import clsx from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'

import { Icon } from '../Icon'
import classes from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
  variant?: 'primary' | 'secondary' | 'tertiary' | 'gradient' | 'gold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  fullWidth,
  variant = 'primary',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={clsx(
        classes.root,
        className,
        classes[variant],
        {
          [classes.fullWidth]: fullWidth,
        },
      )}
    >
      {variant === 'tertiary' && (
        <Icon
          name='arrowRight'
          size={15}
          className={classes.icon}
        />
      )}
      {children}
      {variant !== 'tertiary' && variant !== 'gradient' && (
        <Icon
          name='arrowRight'
          size={11}
          className={classes.icon}
        />
      )}
    </button>
  )
})
