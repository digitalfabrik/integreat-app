import { ColorsType, commonLightColors, commonHighContrastColors } from '../../common/theme/colors'

const themeColor = '#fbda16'
const themeColorLight = 'rgba(251, 218, 22, 0.5)'
const themeContrast = '#000000'

export const lightColors: ColorsType = {
  themeColor,
  themeColorLight,
  themeContrast,
  ...commonLightColors,
}

export const highContrastColors: ColorsType = {
  themeColor,
  ...commonHighContrastColors,
}
