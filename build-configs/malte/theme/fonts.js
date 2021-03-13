// @flow

import type { FontsType } from '../../common/theme/fonts'
import { commonFonts } from '../../common/theme/fonts'

const fonts: FontsType = {
  native: {
    decorativeFontBold: 'Raleway-Bold',
    decorativeFontRegular: 'Raleway-Regular',
    contentFontRegular: 'OpenSans-Regular',
    contentFontBold: 'OpenSans-Bold',
    webviewFont: '\'OpenSans\', Lateef, sans-serif'
  },
  web: {
    decorativeFont: '\'Raleway\', \'Lateef\', sans-serif',
    contentFont: '\'Open Sans\', \'Lateef\', sans-serif'
  },
  ...commonFonts
}

export default fonts
