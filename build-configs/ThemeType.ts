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
  active?: string
  hover?: string
  hoverOpacity?: number
  selected?: string
  selectedOpacity?: number
  disabled: string
  disabledOpacity?: number
  disabledBackground?: string
  focus?: string
  focusOpacity?: number
  activatedOpacity?: number
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
