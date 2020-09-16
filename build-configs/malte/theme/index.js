// @flow

import { lightColors, darkColors } from './colors'
import malteFonts from './fonts'
import dimensions from '../../common/dimensions'
import type { ThemeType } from '../../ThemeType'

export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: malteFonts,
  dimensions
}

export const darkTheme: ThemeType = {
  colors: darkColors,
  ...lightTheme
}
