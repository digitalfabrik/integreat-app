// @flow

import malteColors, { darkColors as malteDarkColors } from './colors'
import malteFonts from './fonts'
import dimensions from '../common/dimensions'
import type { ThemeType } from '../ThemeType'

const theme: ThemeType = {
  colors: malteColors,
  fonts: malteFonts,
  dimensions
}

export const darkTheme: ThemeType = {
  ...theme,
  colors: malteDarkColors
}

export default theme
