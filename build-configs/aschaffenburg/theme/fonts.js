// @flow

import type { FontsType } from '../../common/theme/fonts'
import { commonFonts } from '../../common/theme/fonts'

const fonts: FontsType = {
  native: {
    decorativeFontBold: 'VarelaRound-Regular',
    decorativeFontRegular: 'VarelaRound-Regular',
    contentFontRegular: 'OpenSans-Regular',
    contentFontBold: 'OpenSans-Bold',
    webviewFont: 'OpenSans, Lateef, sans-serif'
  },
  web: {
    decorativeFont: 'Varela Round, Lateef, sans-serif',
    contentFont: 'Open Sans, Lateef, sans-serif'
  },
  ...commonFonts
}

export default fonts
