import { Theme } from '../../ThemeType'
import { commonDarkColors, commonLightColors } from '../../common/theme/colors'

const customColors = {
  secondary: {
    // TODO we do not yet have light/dark colors for malte (also the main color might have to be changed to the similarity to the error color)
    light: '#ff0000',
    main: '#ff0000',
    dark: '#ff0000',
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
