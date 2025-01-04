import { FC } from "react"

import { Flex, Icon } from "~/shared/ui"

export const Socials: FC = () => {
  return (
    <Flex gap={19}>
      <Icon name='telegram' />
      <Icon name='twitter' />
      <Icon name='github' />
    </Flex>
  )
}
