import { ColorsType, commonLightColors } from '../../common/theme/colors'

const themeColor = '#ff0000'
const themeColorLight = 'rgba(255, 0, 0, 0.5)'
const themeContrast = '#fff'

export const lightColors: ColorsType = {
  themeColor,
  themeColorLight,
  themeContrast,
  ...commonLightColors,
}
