import { FontsType, commonFonts } from '../../common/theme/fonts'

const fonts: FontsType = {
  native: {
    decorativeFontBold: 'Raleway-Bold',
    decorativeFontRegular: 'Raleway-Regular',
    contentFontRegular: 'OpenSans-Regular',
    contentFontBold: 'OpenSans-Bold',
    webviewFont: 'OpenSans, Lateef, Noto Sans SC, Noto Sans Georgian, sans-serif'
  },
  web: {
    decorativeFont: 'Raleway, Lateef, Noto Sans SC, Noto Sans Georgian, sans-serif',
    contentFont: 'Open Sans, Lateef, Noto Sans SC, Noto Sans Georgian, sans-serif'
  },
  ...commonFonts
}

export default fonts
