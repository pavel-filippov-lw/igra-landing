import './global.scss'
import './fonts/fonts.scss'
import 'react-loading-skeleton/dist/skeleton.css'

import { FC } from "react"
import { SkeletonTheme } from 'react-loading-skeleton'

import { AppRouter } from './router'

export const App: FC = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <AppRouter />
    </SkeletonTheme>
  )
}
