import { CommonColorPalette, CommonColors } from '../../ThemeType'

const commonColors: CommonColors = {
  error: {
    light: '#FFCCCF',
    main: '#DF1D1D',
    dark: '#C40002',
    contrastText: '#E6E0E9',
  },
  warning: {
    main: '#FFA726',
  },
  success: {
    main: '#188038',
  },
  tunews: {
    main: '#0079A6',
    light: '#99CADC',
  },
  divider: '#C9C9C9',
  link: '#4E80EE',
}

export const commonLightColors: CommonColorPalette = {
  ...commonColors,
  mode: 'light',
  primary: {
    light: '#C0DCFF',
    main: '#4B6EDA',
    dark: '#475CC7',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    light: '#EAEEF9',
    main: '#364153',
    dark: '#242D3B',
    contrastText: '#E6E0E9',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    accent: '#EAEEF9',
  },
  text: {
    primary: '#1D1B20',
    secondary: '#585858',
    disabled: '#858585',
  },
  action: {
    disabledBackground: '#FFFFFF',
    disabled: '#C9C9C9',
    active: '#000000',
  },
}

export const commonDarkColors: CommonColorPalette = {
  ...commonColors,
  mode: 'dark',
  primary: {
    light: '#98C7FF',
    main: '#4F8FFD',
    dark: '#475CC7',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    light: '#E9EDFB',
    main: '#AFBACC',
    dark: '#364153',
    contrastText: '#E6E0E9',
  },
  background: {
    default: '#020202',
    paper: '#020202',
    accent: '#20293A',
  },
  text: {
    primary: '#E6E0E9',
    secondary: '#919EB4',
    disabled: '#858585',
  },
  action: {
    disabledBackground: '#000000',
    disabled: '#364153',
    active: '#FFFFFF',
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
  tunewsThemeColorLight: 'rgb(0, 122, 168, 0.4)',
  borderColor: '#F1F1F1',
  positiveHighlight: '#188038',
  negativeHighlight: '#8b0000',
  invalidInput: '#B3261E',
  warningColor: '#FFA726',
  linkColor: '#0b57d0',
  ttsPlayerWarningBackground: '#fffde6',
  ttsPlayerWarningColor: '#f97c00',
  ttsPlayerBackground: '#dedede',
  ttsPlayerPlayIconColor: '#007aa8',
}
export const legacyCommonContrastColors = {
  ...legacyCommonLightColors,
  backgroundAccentColor: '#20293A',
  textColor: '#FFFFFF',
  textDisabledColor: '#4C5F73',
  textSecondaryColor: '#FFFFFF',
  backgroundColor: '#101217',
  borderColor: '#FFFFFF',
  positiveHighlight: '#22c253',
  negativeHighlight: '#FF3636',
  invalidInput: '#FF3636',
  linkColor: '#3B82F6',
  ttsPlayerBackground: '#29354B',
}
