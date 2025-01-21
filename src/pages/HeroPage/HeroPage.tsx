import { FC } from "react"

import { Header, Hero, Layout } from "~/Components"

export const HeroPage: FC = () => {
  return (
    <div>
      <Header />
      <Layout>
        <Hero />
      </Layout>
    </div>
  )
}
