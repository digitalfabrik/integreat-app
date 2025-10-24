import { legacyCommonContrastColors, LegacyColorsType, legacyCommonLightColors } from '../../common/theme/colors'

const themeColor = '#E55129'
const themeColorLight = 'rgb(229, 81, 41, 0.5)'
const themeContrast = '#000000'

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
