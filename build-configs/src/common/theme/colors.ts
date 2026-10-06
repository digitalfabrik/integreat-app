import type { CommonColorPalette, CommonColors } from '../../ThemeType.ts'

const commonColors: CommonColors = {
  tuNews: {
    main: '#0079A6',
    contrastText: '#FFFFFF',
  },
  amalNews: {
    main: '#1A7579',
    contrastText: '#FFFFFF',
  },
}

export const commonLightColors: CommonColorPalette = {
  ...commonColors,
  mode: 'light',
  primary: {
    light: '#4E80EE',
    main: '#4B6EDA',
    dark: '#475CC7',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    light: '#455369',
    main: '#364153',
    dark: '#242D3B',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    accent: '#EAEEF9',
  },
  text: {
    primary: '#1D1B20',
    secondary: '#585858',
    disabled: '#6E6E6E',
  },
  action: {
    disabledBackground: '#E0E0E0',
    disabled: '#616161',
    active: '#242D3B',
  },
  error: {
    light: '#E22A2A',
    main: '#DF1D1D',
    dark: '#C40002',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#15742F',
    contrastText: '#E6E0E9',
  },
  warning: {
    main: '#8F5806',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0863BF',
    contrastText: '#FFFFFF',
  },
  divider: '#767676',
}

export const commonDarkColors: CommonColorPalette = {
  ...commonColors,
  mode: 'dark',
  primary: {
    light: '#C0DCFF',
    main: '#98C7FF',
    dark: '#4F8FFD',
    contrastText: '#1D1B20',
  },
  tertiary: {
    light: '#E9EDFB',
    main: '#AFBACC',
    dark: '#7A89A2',
    contrastText: '#1D1B20',
  },
  background: {
    default: '#020202',
    paper: '#1E1E1E',
    accent: '#20293A',
  },
  text: {
    primary: '#E6E0E9',
    secondary: '#919EB4',
    disabled: '#9A9A9A',
  },
  action: {
    disabledBackground: '#393939',
    disabled: '#A5A5A5',
    active: '#E6E0E9',
  },
  error: {
    light: '#FFCCCF',
    main: '#F89894',
    dark: '#F16E6A',
    contrastText: '#1D1B20',
  },
  success: {
    main: '#67C584',
    contrastText: '#1D1B20',
  },
  warning: {
    main: '#F69F1D',
    contrastText: '#1D1B20',
  },
  info: {
    main: '#74B7F9',
    contrastText: '#1D1B20',
  },
  divider: '#C9C9C9',
}
