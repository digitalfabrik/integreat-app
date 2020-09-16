// @flow

import type { FontsType } from '../../common/fonts'
import { commonFonts } from '../../common/fonts'

const fonts: FontsType = {
  decorativeFontBold: 'Raleway-Bold',
  decorativeFontRegular: 'Raleway-Regular',
  contentFontRegular: 'OpenSans-Regular',
  contentFontBold: 'OpenSans-Bold',
  arabicWebviewFontFamilies: '\'OpenSans\', \'Lateef\', sans-serif',
  webviewFontFamilies: '\'OpenSans\', sans-serif',
  ...commonFonts
}

export default fonts
