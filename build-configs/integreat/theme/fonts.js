// @flow

import type { FontsType } from '../../common/theme/fonts'
import { commonFonts } from '../../common/theme/fonts'

const fonts: FontsType = {
  native: {
    decorativeFontBold: 'Raleway-Bold',
    decorativeFontRegular: 'Raleway-Regular',
    contentFontRegular: 'OpenSans-Regular',
    contentFontBold: 'OpenSans-Bold',
    webviewFont: 'OpenSans, Lateef, Noto Sans SC, sans-serif'
  },
  web: {
    decorativeFont: 'Raleway, Lateef, Noto Sans SC, sans-serif',
    contentFont: 'Open Sans, Lateef, Noto Sans SC, sans-serif'
  },
  ...commonFonts
}

export default fonts
