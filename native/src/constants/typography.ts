import { TypographyType } from 'build-configs/TypographyType'
import { FontsType } from 'build-configs/common/theme/fonts'

export const prepareTypography = (fonts: FontsType): TypographyType => ({
  fontFamily: fonts.native.contentFontRegular,
  decorativeFontFamily: fonts.native.decorativeFontBold,
  h1: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  h4: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  h5: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  h6: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  subtitle2: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '600',
    fontFamily: fonts.native.decorativeFontBold,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: '400',
    fontFamily: fonts.native.contentFontRegular,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: '400',
    fontFamily: fonts.native.contentFontRegular,
  },
  body3: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '400',
    fontFamily: fonts.native.contentFontRegular,
  },
  button: {
    fontSize: 14,
    lineHeight: 36,
    letterSpacing: 1.25,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontFamily: fonts.native.contentFontBold,
  },
  caption: {
    fontFamily: fonts.native.contentFontRegular,
  },
  overline: {
    fontFamily: fonts.native.contentFontRegular,
  },
})
