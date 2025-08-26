import { LegacyThemeType } from '../../LegacyThemeType'
import { Theme } from '../../ThemeType'
import { commonDarkColors, commonLightColors } from '../../common/theme/colors'
import { legacyContrastColors, legacyLightColors } from './colors'
import integreatFonts from './fonts'

const customColors = {
  secondary: {
    light: '#FFFDE6',
    main: '#FBDA16',
    dark: '#FAA700',
    contrastText: '#1D1B20',
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
  fonts: integreatFonts,
}

export const legacyContrastTheme: LegacyThemeType = {
  colors: legacyContrastColors,
  fonts: integreatFonts,
}
