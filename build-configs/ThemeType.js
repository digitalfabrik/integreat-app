// @flow

import type { ColorsType } from './common/theme/colors'
import type { DimensionsType } from './common/theme/dimensions'
import type { FontsType } from './common/theme/fonts'
import type { HelpersType } from './common/theme/helpers'

export type ThemeType = {|
  colors: ColorsType,
  dimensions: DimensionsType,
  fonts: FontsType,
  helpers: HelpersType
|}
