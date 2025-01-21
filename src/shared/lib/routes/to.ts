import { Routes } from './Routes.ts'

class To {
  hero = () => `/${Routes.hero}`

  team = () => `/${Routes.team}`
}

export const to = new To()

export type Paths = ReturnType<To[keyof To]>;
