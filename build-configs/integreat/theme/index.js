// @flow

import integreatColors, { darkColors as integreatDarkColors } from './colors'
import integreatFonts from './fonts'
import dimensions from '../../common/theme/dimensions'
import helpers from '../../common/theme/helpers'
import type { ThemeType } from '../../ThemeType'

const theme: ThemeType = {
  colors: integreatColors,
  fonts: integreatFonts,
  dimensions,
  helpers
}

export const darkTheme: ThemeType = {
  ...theme,
  colors: integreatDarkColors
}

export default theme
