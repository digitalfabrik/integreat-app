// CSS clamp()
type AdaptiveFont = {
  min: string
  value: string
  max: string
}

export type FontsType = {
  native: {
    decorativeFontBold: string
    decorativeFontRegular: string
    contentFontRegular: string
    contentFontBold: string
    webviewFont: string
  }
  web: {
    decorativeFont: string
    contentFont: string
  }
  adaptiveFontSizeSmall: AdaptiveFont
  fontSizeAdjust: number
  decorativeFontSize: string
  decorativeFontSizeSmall: string
  decorativeLineHeight: number
  contentFontSize: string
  contentLineHeight: number
  standardParagraphMargin: string
  subTitleFontSize: string
  hintFontSize: string
}
export const commonFonts = {
  fontSizeAdjust: 0.55,
  decorativeFontSize: '0.95rem',
  decorativeFontSizeSmall: '0.7rem',
  decorativeLineHeight: 1.3,
  contentFontSize: '0.95rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.1rem',
  hintFontSize: '0.85rem',
  adaptiveFontSizeSmall: { min: '0.55rem', value: '1.6vh', max: '0.85rem' },
}
