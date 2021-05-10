import { lightColors, darkColors } from './colors'
import malteFonts from './fonts'
import { ThemeType } from '../../ThemeType'
export const lightTheme: ThemeType = {
  colors: lightColors,
  fonts: malteFonts
}
export const darkTheme: ThemeType = {
  colors: darkColors,
  ...lightTheme
}
