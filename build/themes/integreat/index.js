// @flow

import integreatColors, { darkColors as integreatDarkColors } from './colors'
import integreatFonts from './fonts'
import dimensions from '../common/dimensions'
import helpers from '../common/helpers'
import type { ThemeType } from '../ThemeType'

const theme: ThemeType = {
  colors: integreatColors,
  fonts: integreatFonts,
  dimensions,
  helpers
}

export const darkTheme: ThemeType = {
  colors: integreatDarkColors,
  ...theme
}

export default theme
