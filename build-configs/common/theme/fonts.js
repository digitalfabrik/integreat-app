// @flow

export type FontsType = {|
  fontSizeAdjust: number,
  decorativeFontBold: string,
  decorativeFontRegular: string,
  decorativeFontSize: string,
  decorativeLineHeight: number,
  decorativeFontFamily: string,
  contentFontRegular: string,
  contentFontBold: string,
  contentFontFamily: string,
  arabicWebviewFontFamilies: string, // used for 'ar', 'fa' and 'ku'
  webviewFontFamilies: string, // used for all other languages
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
