import type { CommonColorPalette, CommonColors } from '../../ThemeType.ts'

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
  tuNews: {
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
  ttsPlayer: {
    background: '#dedede',
    playIconColor: '#007aa8',
  },
  chat: {
    background: '#FFFFFF',
    headerBackground: '#EAEEF9',
    messageBackground: '#EAEEF9',
    userMessageBackground: '#F5F5F5',
    messageBorderColor: 'transparent',
    headerActionBackground: '#FFFFFF',
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
    dark: '#242D3B',
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
  ttsPlayer: {
    background: '#29354B',
    playIconColor: '#007aa8',
  },
  chat: {
    background: '#1E1E1E',
    headerBackground: '#1E1E1E',
    messageBackground: '#181818',
    userMessageBackground: '#20293A',
    messageBorderColor: '#C9C9C9',
    headerActionBackground: 'transparent',
  },
}
