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
    light: '#EF5350',
    main: '#D32F2F',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FF9800',
    main: '#ED6C02',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },
  info: {
    light: '#03A9F4',
    main: '#0288D1',
    dark: '#01579B',
    contrastText: '#FFFFFF',
  },
  success: {
    light: '#4CAF50',
    main: '#2E7D32',
    dark: '#1B5E20',
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
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
    contrastText: '#1D1B20',
  },
  warning: {
    light: '#FFB74D',
    main: '#FFA726',
    dark: '#F57C00',
    contrastText: '#1D1B20',
  },
  info: {
    light: '#4FC3F7',
    main: '#29B6F6',
    dark: '#0288D1',
    contrastText: '#1D1B20',
  },
  success: {
    light: '#81C784',
    main: '#66BB6A',
    dark: '#388E3C',
    contrastText: '#1D1B20',
  },
  divider: '#C9C9C9',
}
