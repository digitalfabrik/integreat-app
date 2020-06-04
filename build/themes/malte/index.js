// @flow

import malteColors, { darkColors as malteDarkColors } from './colors'
import malteFonts from './fonts'
import dimensions from '../common/dimensions'
import helpers from '../common/helpers'
import type { ThemeType } from '../ThemeType'

const theme: ThemeType = {
  colors: malteColors,
  fonts: malteFonts,
  dimensions,
  helpers
}

export const darkTheme: ThemeType = {
  colors: malteDarkColors,
  ...theme
}

export default theme
