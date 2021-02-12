// @flow

import { commonLightColors, commonDarkColors } from '../../common/theme/colors'
import type { ColorsType } from '../../common/theme/colors'

const themeColor = '#009684'

export const darkColors: ColorsType = {
  themeColor,
  ...commonDarkColors
}

export const lightColors: ColorsType = {
  themeColor,
  ...commonLightColors
}
