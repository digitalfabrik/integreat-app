import { FontsType, commonFonts } from '../../common/theme/fonts'

const fonts: FontsType = {
  native: {
    decorativeFontBold: 'VarelaRound-Regular',
    decorativeFontRegular: 'VarelaRound-Regular',
    contentFontRegular: 'NotoSans',
    contentFontBold: 'NotoSans-Bold',
    webviewFont: 'Noto Sans, Noto Sans Arabic, Noto Sans SC, Noto Sans Georgian, sans-serif',
  },
  web: {
    decorativeFont: 'Varela Round, Noto Sans Arabic, Noto Sans SC, Noto Sans Georgian, sans-serif',
    contentFont: 'Noto Sans, Noto Sans Arabic, Noto Sans SC, Noto Sans Georgian, sans-serif',
  },
  ...commonFonts,
}

export default fonts
