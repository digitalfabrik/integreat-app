import { LegacyThemeType } from '../../LegacyThemeType'
import { Theme } from '../../ThemeType'
import { commonDarkColors, commonLightColors } from '../../common/theme/colors'
import { legacyContrastColors, legacyLightColors } from './colors'
import obdachFonts from './fonts'

const customColors = {
  secondary: {
    // TODO we do not yet have light/dark colors for obdach
    light: '#E55129',
    main: '#E55129',
    dark: '#E55129',
    contrastText: '#E6E0E9',
  },
}

export const lightTheme: Theme = {
  palette: {
    ...commonLightColors,
    ...customColors,
  },
}

export const darkTheme: Theme = {
  palette: {
    ...commonDarkColors,
    ...customColors,
  },
}

export const legacyLightTheme: LegacyThemeType = {
  colors: legacyLightColors,
  fonts: obdachFonts,
}

export const legacyContrastTheme: LegacyThemeType = {
  colors: legacyContrastColors,
  fonts: obdachFonts,
}
