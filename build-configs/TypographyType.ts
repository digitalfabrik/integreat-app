import * as CSS from 'csstype'
import React from 'react'

type TypographyVariant =
  | 'display1'
  | 'display2'
  | 'display3'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'label1'
  | 'label2'
  | 'label3'
  | 'chip1'
  | 'chip2'
  | 'chip3'
  | 'textLink'
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
  decorativeFontFamily: React.CSSProperties['fontFamily']
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
export type TypographyType = TypographyVariantsOptions
