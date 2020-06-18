// @flow

import integreatColors, { darkColors as integreatDarkColors } from './colors'
import integreatFonts from './fonts'
import dimensions from '../common/dimensions'
import type { ThemeType } from '../ThemeType'

const theme: ThemeType = {
  colors: integreatColors,
  fonts: integreatFonts,
  dimensions
}

export const darkTheme: ThemeType = {
  ...theme,
  colors: integreatDarkColors
}

export default theme
