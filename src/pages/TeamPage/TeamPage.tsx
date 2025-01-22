import { FC } from "react"

import { Header, Layout, Team } from "~/Components"

export const TeamPage: FC = () => {
  return (
    <div>
      <Header />
      <Layout>
        <Team />
      </Layout>
    </div>
  )
}
