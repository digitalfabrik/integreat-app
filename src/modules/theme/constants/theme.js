// @flow

import type { ColorsType } from './colors'
import { brightColors, darkColors } from './colors'
import type { DimensionsType } from './dimensions'
import dimensions from './dimensions'
import type { FontsType } from './fonts'
import fonts from './fonts'

export type ThemeType = {
  colors: ColorsType,
  dimensions: DimensionsType,
  fonts: FontsType
}

export const brightTheme = {
  colors: brightColors,
  dimensions,
  fonts
}

export const darkTheme = {
  colors: darkColors,
  dimensions,
  fonts
}

export default brightTheme
