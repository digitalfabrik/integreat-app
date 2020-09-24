// @flow

import { commonColors, commonDarkColors } from '../../common/theme/colors'
import type { ColorsType } from '../../common/theme/colors'

const themeColor = '#ff0000'

export const darkColors: ColorsType = {
  themeColor,
  ...commonDarkColors
}

const colors: ColorsType = {
  themeColor,
  ...commonColors
}

export default colors
