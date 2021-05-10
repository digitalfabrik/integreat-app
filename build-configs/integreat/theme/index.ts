import { lightColors, darkColors } from './colors'
import integreatFonts from './fonts'
import { ThemeType } from '../../ThemeType'
export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: integreatFonts
}
export const darkTheme: ThemeType = {
  colors: darkColors,
  ...lightTheme
}
