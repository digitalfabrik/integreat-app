// @flow

import { commonColors, commonDarkColors } from '../common/colors'
import type { ColorsType } from '../common/colors'

const themeColor = '#fbda16'

export const darkColors: ColorsType = {
  themeColor,
  ...commonDarkColors
}

const colors: ColorsType = {
  themeColor,
  ...commonColors
}

export default colors
