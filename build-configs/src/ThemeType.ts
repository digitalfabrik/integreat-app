export type SimplePaletteColor = {
  main: string
  contrastText: string
}

export type PaletteColor = SimplePaletteColor & {
  light: string
  dark: string
}

export type ActionColor = {
  disabled: string
  disabledBackground: string
  active?: string
  hover?: string
  selected?: string
  selectedOpacity?: number
  focus?: string
}

export type CommonColors = {
  tuNews: SimplePaletteColor
  amalNews: SimplePaletteColor
}

export type PaletteMode = 'light' | 'dark'

export type TypeText = {
  primary: string
  secondary: string
  disabled: string
}

export type TypeBackground = {
  default: string
  paper: string
  accent: string
}

export type CommonColorPalette = CommonColors & {
  mode: PaletteMode
  primary: PaletteColor
  tertiary: PaletteColor
  background: TypeBackground
  text: TypeText
  action: ActionColor
  error: PaletteColor
  success: SimplePaletteColor
  warning: SimplePaletteColor
  info: SimplePaletteColor
  divider: string
}

export type ThemeColorPalette = CommonColorPalette & {
  secondary: PaletteColor
}

export type Theme = {
  palette: ThemeColorPalette
}
