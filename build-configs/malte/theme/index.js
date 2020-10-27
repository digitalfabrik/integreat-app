// @flow

import { lightColors, darkColors } from './colors'
import malteFonts from './fonts'
import dimensions from '../../common/theme/dimensions'
import helpers from '../../common/theme/helpers'
import type { ThemeType } from '../../ThemeType'

export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: malteFonts,
  dimensions,
  helpers
}

export const darkTheme: ThemeType = {
  colors: darkColors,
  ...lightTheme
}
