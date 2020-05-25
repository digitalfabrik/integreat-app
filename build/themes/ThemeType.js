// @flow

import type { ColorsType } from './common/colors'
import type { DimensionsType } from './common/dimensions'
import type { FontsType } from './common/fonts'
import type { HelpersType } from './common/helpers'

export type ThemeType = {|
  colors: ColorsType,
  dimensions: DimensionsType,
  fonts: FontsType,
  helpers: HelpersType
|}
