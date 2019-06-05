// @flow

export type FontsType = {
  fontSizeAdjust: number,
  decorativeFontFamilyBold: string,
  decorativeFontFamilyRegular: string,
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
  decorativeFontBold: 'Raleway-Bold',
  decorativeFontRegular: 'Raleway-Regular',
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
  decorativeFontFamilyBold: 'Raleway-Bold',
  decorativeFontFamilyRegular: 'Raleway-Regular',
  decorativeFontSize: '0.95rem',
  decorativeLineHeight: 1.3,
  contentFontFamilyRegular: 'OpenSans-Regular',
  contentFontFamilyBold: 'OpenSans-Bold',
  contentFontSize: '0.95rem',
  contentLineHeight: 1.4,
  standardParagraphMargin: '0.75rem',
  subTitleFontSize: '1.8rem'
}
