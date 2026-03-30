declare module 'react-simple-maps' {
  import { FC, ReactNode, SVGProps } from 'react'

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    className?: string
    children?: ReactNode
  }
  export const ComposableMap: FC<ComposableMapProps>

  interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    children?: ReactNode
  }
  export const ZoomableGroup: FC<ZoomableGroupProps>

  interface GeographiesProps {
    geography: string | object
    children: (data: { geographies: Array<{ rsmKey: string }> }) => ReactNode
  }
  export const Geographies: FC<GeographiesProps>

  interface GeographyProps {
    geography: object
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: Record<string, unknown>
      hover?: Record<string, unknown>
      pressed?: Record<string, unknown>
    }
    [key: string]: unknown
  }
  export const Geography: FC<GeographyProps>

  interface MarkerProps {
    coordinates: [number, number]
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    children?: ReactNode
  }
  export const Marker: FC<MarkerProps>
}
