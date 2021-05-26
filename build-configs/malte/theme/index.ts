import { darkColors, lightColors } from './colors'
import malteFonts from './fonts'
import { ThemeType } from '../../ThemeType'

export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: malteFonts
}
export const darkTheme: ThemeType = {
  ...lightTheme,
  colors: darkColors
}
