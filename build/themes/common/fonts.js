// @flow

export type FontsType = {|
  fontSizeAdjust: number,
  decorativeFontFamily: string,
  decorativeFontSize: string,
  decorativeLineHeight: number,
  contentFontFamily: string,
  contentFontSize: string,
  contentLineHeight: number,
  standardParagraphMargin: string,
  subTitleFontSize: string
|}

export const commonFonts = {
  fontSizeAdjust: 0.55,
  decorativeFontSize: '0.95rem',
  decorativeLineHeight: 1.3,
  contentFontSize: '0.95rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.8rem'
}
