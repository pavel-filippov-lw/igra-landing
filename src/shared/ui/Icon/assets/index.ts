import Cube_1 from './cube_1.svg?react'
import Cube_2 from './cube_2.svg?react'
import Cube_3 from './cube_3.svg?react'
import Cube_4 from './cube_4.svg?react'
import Github from './github.svg?react'
import Gitlab from './gitlab.svg?react'
import Telegram from './telegram.svg?react'
import Twitter from './twitter.svg?react'

export const icons = {
  github: { Component: Github },
  gitlab: { Component: Gitlab },
  telegram: { Component: Telegram },
  twitter: { Component: Twitter },
  cube_1: { Component: Cube_1 },
  cube_2: { Component: Cube_2 },
  cube_3: { Component: Cube_3 },
  cube_4: { Component: Cube_4 },
} as const

export type IconName = keyof typeof icons
