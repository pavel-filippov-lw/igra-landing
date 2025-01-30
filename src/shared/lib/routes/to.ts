import { Routes } from './Routes.ts'

class To {
  hero = () => `/${Routes.hero}`
  team = () => `/${Routes.team}`
  manifesto = () => `/${Routes.manifesto}`
  vision = () => `/${Routes.vision}`
}

export const to = new To()

export type Paths = ReturnType<To[keyof To]>;
