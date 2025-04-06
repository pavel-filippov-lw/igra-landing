import { FC } from "react"

import { Hero, HeroBenefits, PageLayout } from "~/Components"
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
      </Flex>
    </PageLayout>
  )
}
