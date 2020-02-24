// @flow

export type FontsType = {
  fontSizeAdjust: number,
  decorativeFontBold: string,
  decorativeFontRegular: string,
  decorativeFontSize: string,
  decorativeLineHeight: number,
  contentFontRegular: string,
  contentFontBold: string,
  webviewFontFamilies: string,
  contentFontSize: string,
  contentLineHeight: number,
  standardParagraphMargin: string,
  subTitleFontSize: string
}

export const arabicFonts: FontsType = { // used for 'ar', 'fa' and 'ku'
  fontSizeAdjust: 0.55,
  decorativeFontBold: 'Raleway-Bold',
  decorativeFontRegular: 'Raleway-Regular',
  decorativeFontSize: '0.95rem',
  decorativeLineHeight: 1.3,
  contentFontRegular: 'OpenSans-Regular',
  contentFontBold: 'OpenSans-Bold',
  webviewFontFamilies: '\'OpenSans\', \'Lateef\', sans-serif',
  contentFontSize: '0.95rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.8rem'
}

export const defaultFonts: FontsType = { // used for all other languages
  fontSizeAdjust: 0.55,
  decorativeFontBold: 'Raleway-Bold',
  decorativeFontRegular: 'Raleway-Regular',
  decorativeFontSize: '0.95rem',
  decorativeLineHeight: 1.3,
  contentFontRegular: 'OpenSans-Regular',
  contentFontBold: 'OpenSans-Bold',
  webviewFontFamilies: '\'OpenSans\', sans-serif',
  contentFontSize: '0.95rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.8rem'
}
