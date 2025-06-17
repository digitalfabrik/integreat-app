import * as CSS from 'csstype'
import React from 'react'

import { PaletteColor, PaletteMode, TypeText } from './ThemeType'

type PaletteTonalOffset =
  | number
  | {
      light: number
      dark: number
    }

/* eslint-disable no-magic-numbers */
type Color = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  A100: string
  A200: string
  A400: string
  A700: string
}

type PaletteColorOptions = PaletteColor
type PaletteAugmentColorOptions = {
  color: PaletteColorOptions
  mainShade?: number | string
  lightShade?: number | string
  darkShade?: number | string
  name?: number | string
}

type TypeAction = {
  active: string
  hover: string
  hoverOpacity: number
  selected: string
  selectedOpacity: number
  disabled: string
  disabledOpacity: number
  disabledBackground: string
  focus: string
  focusOpacity: number
  activatedOpacity: number
}

type TypeBackground = {
  default: string
  paper: string
}

type CommonColors = {
  black: string
  white: string
}

type Palette = {
  common: CommonColors
  mode: PaletteMode
  contrastThreshold: number
  tonalOffset: PaletteTonalOffset
  primary: PaletteColor
  secondary: PaletteColor
  error: PaletteColor
  warning: PaletteColor
  info: PaletteColor
  success: PaletteColor
  grey: Color
  text: TypeText
  divider: string
  action: TypeAction
  background: TypeBackground
  getContrastText: (background: string) => string
  augmentColor: (options: PaletteAugmentColorOptions) => PaletteColor
}

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'caption'
  | 'button'
  | 'overline'
type FontStyle = {
  fontFamily: React.CSSProperties['fontFamily']
  fontSize: number
  fontWeightLight: React.CSSProperties['fontWeight']
  fontWeightRegular: React.CSSProperties['fontWeight']
  fontWeightMedium: React.CSSProperties['fontWeight']
  fontWeightBold: React.CSSProperties['fontWeight']
  htmlFontSize: number
}
type FontStyleOptions = Partial<FontStyle> & {
  allVariants?: React.CSSProperties
}

type NormalCssProperties = CSS.Properties<number | string>
type Fontface = CSS.AtRule.FontFace & {
  fallbacks?: CSS.AtRule.FontFace[]
}
type BaseCSSProperties = NormalCssProperties & {
  '@font-face'?: Fontface | Fontface[]
}
type CSSProperties = BaseCSSProperties & {
  // Allow pseudo selectors and media queries
  // `unknown` is used since TS does not allow assigning an interface without
  // an index signature to one with an index signature. This is to allow type safe
  // module augmentation.
  // Technically we want any key not typed in `BaseCSSProperties` to be of type
  // `CSSProperties` but this doesn't work. The index signature needs to cover
  // BaseCSSProperties as well. Usually you would use `BaseCSSProperties[keyof BaseCSSProperties]`
  // but this would not allow assigning React.CSSProperties to CSSProperties
  [k: string]: unknown | CSSProperties
}

type TypographyStyle = CSSProperties
type TypographyStyleOptions = TypographyStyle & NonNullable<unknown>
type TypographyVariantsOptions = Partial<Record<TypographyVariant, TypographyStyleOptions> & FontStyleOptions>
export type TypographyType = TypographyVariantsOptions | ((palette: Palette) => TypographyVariantsOptions) | undefined
