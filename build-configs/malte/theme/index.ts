import { ThemeType } from '../../ThemeType'
import { contrastColors, lightColors } from './colors'
import malteFonts from './fonts'

export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: malteFonts,
}

export const contrastTheme: ThemeType = {
  colors: contrastColors,
  fonts: malteFonts,
}
