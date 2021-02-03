// @flow

import type { FontsType } from '../../common/theme/fonts'
import { commonFonts } from '../../common/theme/fonts'

const fonts: FontsType = {
  decorativeFontBold: 'VarelaRound-Regular',
  decorativeFontRegular: 'VarelaRound-Regular',
  decorativeFontFamily: '\'Varela Round\', \'Raleway\', \'Lateef\', sans-serif',
  contentFontRegular: 'OpenSans-Regular',
  contentFontBold: 'OpenSans-Bold',
  contentFontFamily: '\'Open Sans\', \'Lateef\', sans-serif',
  arabicWebviewFontFamilies: '\'OpenSans\', \'Lateef\', sans-serif',
  webviewFontFamilies: '\'OpenSans\', sans-serif',
  ...commonFonts
}

export default fonts
