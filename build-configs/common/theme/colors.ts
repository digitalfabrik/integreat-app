import { CommonColorPalette, CommonColors } from '../../ThemeType'

const commonColors: CommonColors = {
  primary: {
    light: '#C0DCFF',
    main: '#4B6EDA',
    dark: '#475CC7',
    contrastText: '#E6E0E9',
  },
  tertiary: {
    light: '#EAEEF9',
    main: '#364153',
    dark: '#242D3B',
    contrastText: '#E6E0E9',
  },
  error: {
    light: '#FFCCCF',
    main: '#DF1D1D',
    dark: '#C40002',
    contrastText: '#E6E0E9',
  },
  warning: {
    // TODO
    main: '#FFA726',
  },
  success: {
    // TODO
    main: '#188038',
  },
  // TODO
  // info: {},
  tunews: {
    main: '#0079A6',
    light: '#99CADC',
  },
  divider: '#C9C9C9',
  link: '#4E80EE',
  action: {
    disabledBackground: '#C9C9C9',
    disabled: '#FFFFFF',
  },
}

export const commonLightColors: CommonColorPalette = {
  ...commonColors,
  mode: 'light',
  surface: {
    light: '#FFFFFF',
    main: '#EAEEF9',
    dark: '#CCD6E4',
    contrastText: '#1D1B20',
  },
  text: {
    primary: '#1D1B20',
    // TODO
    secondary: '#585858',
    disabled: '#858585',
  },
}

export const commonDarkColors: CommonColorPalette = {
  ...commonColors,
  mode: 'dark',
  surface: {
    light: '#333D51',
    main: '#20293A',
    dark: '#020202',
    contrastText: '#E6E0E9',
  },
  text: {
    primary: '#E6E0E9',
    // TODO
    secondary: '#E6E0E9',
    disabled: '#858585',
  },
}

export type LegacyColorsType = {
  themeColor: string
  themeColorLight: string
  backgroundAccentColor: string
  textColor: string
  textSecondaryColor: string
  textDecorationColor: string
  textDisabledColor: string
  footerLineColor: string
  backgroundColor: string
  tunewsThemeColor: string
  tunewsThemeColorLight: string
  borderColor: string
  positiveHighlight: string
  negativeHighlight: string
  invalidInput: string
  warningColor: string
  linkColor: string
  themeContrast: string
  ttsPlayerWarningBackground: string
  ttsPlayerWarningColor: string
  ttsPlayerBackground: string
  ttsPlayerPlayIconColor: string
}

export const legacyCommonLightColors = {
  backgroundAccentColor: '#fafafa',
  textColor: '#000000',
  textSecondaryColor: '#585858',
  textDecorationColor: '#c7c7c7',
  textDisabledColor: '#d0d0d0',
  footerLineColor: '#b1b1b1',
  backgroundColor: '#ffffff',
  tunewsThemeColor: '#007aa8',
  tunewsThemeColorLight: 'rgba(0, 122, 168, 0.4)',
  borderColor: '#F1F1F1',
  positiveHighlight: '#188038',
  negativeHighlight: '#8b0000',
  invalidInput: '#B3261E',
  warningColor: '#FFA726',
  linkColor: '#0b57d0',
  ttsPlayerWarningBackground: '#fffde6',
  ttsPlayerWarningColor: '#f97c00',
  ttsPlayerBackground: '#dedede',
  ttsPlayerPlayIconColor: '#232323',
}
export const legacyCommonContrastColors = {
  ...legacyCommonLightColors,
  backgroundAccentColor: '#20293A',
  textColor: '#FFFFFF',
  textSecondaryColor: '#FFFFFF',
  backgroundColor: '#101217',
  borderColor: '#FFFFFF',
  positiveHighlight: '#22c253',
  negativeHighlight: '#FF3636',
  invalidInput: '#FF3636',
  linkColor: '#3B82F6',
}
