import { legacyCommonContrastColors, LegacyColorsType, legacyCommonLightColors } from '../../common/theme/colors'

const themeColor = '#ff0000'
const themeColorLight = 'rgb(255, 0, 0, 0.5)'
const themeContrast = '#fff'

export const legacyLightColors: LegacyColorsType = {
  themeColor,
  themeColorLight,
  themeContrast,
  ...legacyCommonLightColors,
}

export const legacyContrastColors: LegacyColorsType = {
  themeColor,
  themeColorLight,
  themeContrast,
  ...legacyCommonContrastColors,
}
