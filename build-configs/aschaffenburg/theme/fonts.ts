import { FontsType } from '../../common/theme/fonts'
import { commonFonts } from '../../common/theme/fonts'
const fonts: FontsType = {
  native: {
    decorativeFontBold: 'VarelaRound-Regular',
    decorativeFontRegular: 'VarelaRound-Regular',
    contentFontRegular: 'OpenSans-Regular',
    contentFontBold: 'OpenSans-Bold',
    webviewFont: 'OpenSans, Lateef, Noto Sans SC, Noto Sans Georgian, sans-serif'
  },
  web: {
    decorativeFont: 'Varela Round, Lateef, Noto Sans SC, Noto Sans Georgian, sans-serif',
    contentFont: 'Open Sans, Lateef, Noto Sans SC, Noto Sans Georgian, sans-serif'
  },
  ...commonFonts
}
export default fonts
