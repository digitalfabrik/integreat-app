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
  fontSizeAdjust: number
  decorativeFontSize: string
  decorativeLineHeight: number
  contentFontSizeSmall: string
  contentFontSize: string
  contentLineHeight: number
  standardParagraphMargin: string
  subTitleFontSize: string
  hintFontSize: string
}
export const commonFonts = {
  fontSizeAdjust: 0.55,
  decorativeFontSize: '0.95rem',
  decorativeLineHeight: 1.3,
  contentFontSize: '0.95rem',
  contentFontSizeSmall: '0.75rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.8rem',
  hintFontSize: '0.85rem'
}
