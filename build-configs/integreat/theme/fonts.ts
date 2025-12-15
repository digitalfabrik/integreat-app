import { commonFonts, FontsType } from '../../common/theme/fonts'

const fonts: FontsType = {
  native: {
    decorativeFontBold: 'Raleway-Bold',
    decorativeFontRegular: 'Raleway-Regular',
    contentFontRegular: 'Inter-Regular',
    contentFontBold: 'Inter-Bold',
    webviewFont: 'Inter, Noto Sans, Noto Sans Arabic, Noto Sans SC, Noto Sans Georgian, sans-serif',
  },
  web: {
    decorativeFont: 'Raleway, Noto Sans Arabic, Noto Sans SC, Noto Sans Georgian, sans-serif',
    contentFont: 'Inter, Noto Sans, Noto Sans Arabic, Noto Sans SC, Noto Sans Georgian, sans-serif',
  },
  ...commonFonts,
}

export default fonts
