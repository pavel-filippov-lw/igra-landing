import './global.scss'
import './fonts/fonts.scss'

import { FC } from "react"

import { Header, Hero, Layout } from '~/Components'

export const App: FC = () => {
  return (
    <div>
      <Header />
      <Layout>
        <Hero />
      </Layout>
    </div>
  )
}
