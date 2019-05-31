// @flow

export type FontsType = {
  fontSizeAdjust: number,
  decorativeFontFamily: string,
  decorativeFontSize: string,
  decorativeLineHeight: number,
  contentFontFamily: string,
  contentFontSize: string,
  contentLineHeight: number,
  standardParagraphMargin: string,
  subTitleFontSize: string
}

export const arabicFonts: FontsType = { // used for 'ar', 'fa' and 'ku'
  fontSizeAdjust: 0.55,
  decorativeFontFamily: 'Lateef',
  decorativeFontSize: '0.95rem',
  decorativeLineHeight: 1.3,
  contentFontFamily: 'Lateef',
  contentFontSize: '0.95rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.8rem'
}

export const defaultFonts: FontsType = { // used for all other languages
  fontSizeAdjust: 0.55,
  decorativeFontFamily: 'Raleway-Bold',
  decorativeFontSize: '0.95rem',
  decorativeLineHeight: 1.3,
  contentFontFamily: 'OpenSans-Regular',
  contentFontSize: '0.95rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.8rem'
}
