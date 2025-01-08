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
      <div
        style={{ color: '#4d4d4d', textAlign: 'center', marginBottom: '20px' }}
      >
        &copy; 2024-2025 Igra Labs
      </div>
    </div>
  )
}
