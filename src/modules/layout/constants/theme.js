// @flow

import colors from './colors'
import dimensions from './dimensions'
import fonts from './fonts'
import helpers from './helpers'
import type { ColorType } from './colors'
import type { DimensionsType } from './dimensions'
import type { FontsType } from './fonts'
import type { HelpersType } from './helpers'

export type ThemeType = {
  colors: ColorType,
  dimensions: DimensionsType,
  fonts: FontsType,
  helpers: HelpersType
}

export default {
  colors,
  dimensions,
  fonts,
  helpers
}
