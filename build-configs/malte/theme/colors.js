// @flow

import { commonLightColors, commonDarkColors } from '../../common/colors'
import type { ColorsType } from '../../common/colors'

const themeColor = '#ff0000'

export const darkColors: ColorsType = {
  themeColor,
  ...commonDarkColors
}

export const lightColors: ColorsType = {
  themeColor,
  ...commonLightColors
}
