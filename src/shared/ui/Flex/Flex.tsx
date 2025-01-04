import clsx from 'clsx'
import { CSSProperties, forwardRef, PropsWithChildren } from 'react'

import classes from './Flex.module.scss'

export interface FlexProps extends PropsWithChildren, Pick<CSSProperties, 'gap' | 'rowGap' | 'columnGap' | 'alignItems' | 'justifyContent' | 'flexDirection' | 'flexWrap'> {
  inline?: boolean
  fullWidth?: boolean;
  fullHeight?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(({
  children,
  fullWidth,
  fullHeight,
  style,
  className,
  inline,
  onClick,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...props,
        ...style,
      }}
      className={clsx(className, classes.root, {
        [classes.inline]: inline,
        [classes.fullWidth]: fullWidth,
        [classes.fullHeight]: fullHeight,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  )
})
