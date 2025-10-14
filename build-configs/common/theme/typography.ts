import { TypographyType } from '../../TypographyType'
import { FontsType } from './fonts'

export const commonTypography = (fonts: FontsType): TypographyType => ({
  fontFamily: fonts.web.contentFont,
  decorativeFontFamily: fonts.web.decorativeFont,
  h1: {
    fontSize: 32,
    lineHeight: '40px',
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: fonts.web.decorativeFont,
  },
  h2: {
    fontSize: 28,
    lineHeight: '36px',
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: fonts.web.decorativeFont,
  },
  h3: {
    fontSize: 24,
    lineHeight: '32px',
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: fonts.web.decorativeFont,
  },
  h4: {
    fontSize: 22,
    lineHeight: '28px',
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: fonts.web.decorativeFont,
  },
  h5: {
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: 0.15,
    fontWeight: 500,
    fontFamily: fonts.web.decorativeFont,
  },
  h6: {
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.1,
    fontWeight: 500,
    fontFamily: fonts.web.decorativeFont,
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: 0.15,
    fontWeight: 500,
    fontFamily: fonts.web.decorativeFont,
  },
  subtitle2: {
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.1,
    fontWeight: 500,
    fontFamily: fonts.web.decorativeFont,
  },
  body1: {
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: 0.5,
    fontWeight: 400,
    fontFamily: fonts.web.contentFont,
  },
  body2: {
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.25,
    fontWeight: 400,
    fontFamily: fonts.web.contentFont,
  },
  body3: {
    fontSize: 12,
    lineHeight: '16px',
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: fonts.web.contentFont,
  },
  button: {
    fontSize: 14,
    lineHeight: '36px',
    letterSpacing: 1.25,
    fontWeight: 600,
    textTransform: 'capitalize',
    fontFamily: fonts.web.contentFont,
  },
  caption: {
    fontFamily: fonts.web.contentFont,
  },
  overline: {
    fontFamily: fonts.web.contentFont,
  },
})
