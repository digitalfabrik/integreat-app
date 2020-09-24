// @flow

import malteColors, { darkColors as malteDarkColors } from './colors'
import malteFonts from './fonts'
import dimensions from '../../common/theme/dimensions'
import helpers from '../../common/theme/helpers'
import type { ThemeType } from '../../ThemeType'

const theme: ThemeType = {
  colors: malteColors,
  fonts: malteFonts,
  dimensions,
  helpers
}

export const darkTheme: ThemeType = {
  ...theme,
  colors: malteDarkColors
}

export default theme
