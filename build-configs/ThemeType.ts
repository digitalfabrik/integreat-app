export type SimplePaletteColor = {
  main: string
  light?: string
}

export type PaletteColor = SimplePaletteColor & {
  light: string
  dark: string
  contrastText: string
}

export type CommonColors = {
  primary: PaletteColor
  tertiary: PaletteColor
  error: PaletteColor
  warning: SimplePaletteColor
  success: SimplePaletteColor
  info?: SimplePaletteColor
  tunews: SimplePaletteColor
  divider: string
  link: string
}

export type CommonColorPalette = CommonColors & {
  mode: 'light' | 'dark'
  surface: PaletteColor
  text: {
    primary: string
    secondary: string
    disabled: string
  }
}

export type ThemeColorPalette = CommonColorPalette & {
  secondary: PaletteColor
}

export type Theme = {
  palette: ThemeColorPalette
}
