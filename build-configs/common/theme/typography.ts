import { TypographyType } from '../../TypographyType'
import fonts from '../../integreat/theme/fonts'

export const commonTypography: TypographyType = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: fonts.web.decorativeFont,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: fonts.web.decorativeFont,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
    fontWeight: 600,
    fontFamily: fonts.web.decorativeFont,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    fontWeight: 400,
    fontFamily: fonts.web.contentFont,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontWeight: 400,
    fontFamily: fonts.web.contentFont,
  },
  body3: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: 400,
    fontFamily: fonts.web.contentFont,
  },
  button: {
    fontSize: 14,
    lineHeight: 36,
    letterSpacing: 1.25,
    fontWeight: 600,
    textTransform: 'capitalize',
    fontFamily: fonts.web.contentFont,
  },
}
