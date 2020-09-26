// @flow

import { commonColors, commonDarkColors } from '../../common/theme/colors'
import type { ColorsType } from '../../common/theme/colors'

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
