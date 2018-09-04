// @flow

import type { ColorsType } from './colors'
import { brightColors, darkColors } from './colors'
import type { DimensionsType } from './dimensions'
import dimensions from './dimensions'
import type { FontsType } from './fonts'
import fonts from './fonts'
import type { HelpersType } from './helpers'
import helpers from './helpers'

export type ThemeType = {
  colors: ColorsType,
  dimensions: DimensionsType,
  fonts: FontsType,
  helpers: HelpersType
}

export const brightTheme = {
  colors: brightColors,
  dimensions,
  fonts,
  helpers
}

export const darkTheme = {
  colors: darkColors,
  dimensions,
  fonts,
  helpers
}

export default brightTheme
