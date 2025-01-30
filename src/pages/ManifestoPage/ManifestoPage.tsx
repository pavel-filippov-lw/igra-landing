import { FC } from "react"

import { Header, Layout, Manifesto } from "~/Components"

export const ManifestoPage: FC = () => {
  return (
    <div>
      <Header />
      <Layout>
        <Manifesto />
      </Layout>
    </div>
  )
}
