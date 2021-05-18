import { darkColors, lightColors } from './colors'
import aschaffenburgFonts from './fonts'
import { ThemeType } from '../../ThemeType'

export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: aschaffenburgFonts
}
export const darkTheme: ThemeType = {
  ...lightTheme,
  colors: darkColors
}
