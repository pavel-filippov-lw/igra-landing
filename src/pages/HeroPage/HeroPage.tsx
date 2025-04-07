import { FC } from "react"

import { Hero, HeroBenefits, PageLayout, Roadmap } from "~/Components"
import { Flex } from "~/shared/ui"

export const HeroPage: FC = () => {
  return (
    <PageLayout>
      <Flex
        flexDirection='column'
        gap={160}
      >
        <Hero />
        <HeroBenefits />
        <Roadmap />
      </Flex>
    </PageLayout>
  )
}
