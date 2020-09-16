// @flow

import { lightColors, darkColors } from './colors'
import integreatFonts from './fonts'
import dimensions from '../../common/dimensions'
import type { ThemeType } from '../../ThemeType'

export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: integreatFonts,
  dimensions
}

export const darkTheme: ThemeType = {
  colors: darkColors,
  ...lightTheme
}
