// @flow

import type { ColorsType } from './colors'
import { brightColors, darkColors } from './colors'
import type { DimensionsType } from './dimensions'
import dimensions from './dimensions'
import type { FontsType } from './fonts'
import {defaultFonts} from './fonts'

export type ThemeType = {
  colors: ColorsType,
  dimensions: DimensionsType,
  fonts: FontsType
}

export const brightTheme: ThemeType = {
  colors: brightColors,
  dimensions,
  fonts: defaultFonts
}

export const darkTheme: ThemeType = {
  colors: darkColors,
  dimensions,
  fonts: defaultFonts
}

export default brightTheme
