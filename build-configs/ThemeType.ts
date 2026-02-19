export type SimplePaletteColor = {
  main: string
  light?: string
}

export type PaletteColor = SimplePaletteColor & {
  light: string
  dark: string
  contrastText: string
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
  error: PaletteColor
  warning: SimplePaletteColor
  success: SimplePaletteColor
  info?: SimplePaletteColor
  tunews: SimplePaletteColor & { light: string }
  divider: string
  link: string
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

export type TypeTtsPlayer = {
  background: string
  playIconColor: string
}

export type CommonColorPalette = CommonColors & {
  mode: PaletteMode
  primary: PaletteColor
  tertiary: PaletteColor
  background: TypeBackground
  text: TypeText
  action: ActionColor
  ttsPlayer: TypeTtsPlayer
}

export type ThemeColorPalette = CommonColorPalette & {
  secondary: PaletteColor
}

export type Theme = {
  palette: ThemeColorPalette
}
