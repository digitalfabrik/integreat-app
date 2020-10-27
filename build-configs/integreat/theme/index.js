// @flow

import { lightColors, darkColors } from './colors'
import integreatFonts from './fonts'
import dimensions from '../../common/theme/dimensions'
import type { ThemeType } from '../../ThemeType'
import helpers from '../../common/theme/helpers'

export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: integreatFonts,
  dimensions,
  helpers
}

export const darkTheme: ThemeType = {
  colors: darkColors,
  ...lightTheme
}
