import { LegacyThemeType } from '../../LegacyThemeType'
import { Theme } from '../../ThemeType'
import { commonDarkColors, commonLightColors } from '../../common/theme/colors'
import { legacyContrastColors, legacyLightColors } from './colors'
import aschaffenburgFonts from './fonts'

const customColors = {
  secondary: {
    // TODO we do not yet have light/dark colors for aschaffenburg
    light: '#009684',
    main: '#009684',
    dark: '#009684',
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
  fonts: aschaffenburgFonts,
}

export const legacyContrastTheme: LegacyThemeType = {
  colors: legacyContrastColors,
  fonts: aschaffenburgFonts,
}
