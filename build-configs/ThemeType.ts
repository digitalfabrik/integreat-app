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
  primary: PaletteColor
  tertiary: PaletteColor
  error: PaletteColor
  warning: SimplePaletteColor
  success: SimplePaletteColor
  info?: SimplePaletteColor
  tunews: SimplePaletteColor
  action: ActionColor
  divider: string
  link: string
}

export type PaletteMode = 'light' | 'dark'

export type TypeText = {
  primary: string
  secondary: string
  disabled: string
}

export type CommonColorPalette = CommonColors & {
  mode: PaletteMode
  surface: PaletteColor
  text: TypeText
}

export type ThemeColorPalette = CommonColorPalette & {
  secondary: PaletteColor
}

export type Theme = {
  palette: ThemeColorPalette
}
