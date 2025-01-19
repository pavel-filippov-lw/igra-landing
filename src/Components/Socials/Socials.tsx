import { FC } from "react"

import { Flex, Icon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

const links = [
  // { iconName: 'telegram', to: '' },
  { iconName: 'twitter', to: 'https://x.com/Igra_Labs' },
  { iconName: 'gitlab', to: 'https://github.com/IGRALABS' },
] as { iconName: IconName, to: string }[]

export interface SocialsProps {
  className: string
}

export const Socials: FC<SocialsProps> = ({ className }) => {
  return (
    <Flex gap={19} className={className}>
      {links.map((link, index) => (
        <a key={index} href={link.to} target='_blank'>
          <Icon name={link.iconName} size={29} />
        </a>
      ))}
    </Flex>
  )
}
