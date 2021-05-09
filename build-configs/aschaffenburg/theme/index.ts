import { lightColors, darkColors } from './colors'
import aschaffenburgFonts from './fonts'
import type { ThemeType } from '../../ThemeType'
export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: aschaffenburgFonts
}
export const darkTheme: ThemeType = {
  colors: darkColors,
  ...lightTheme
}