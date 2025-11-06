import { legacyCommonContrastColors, LegacyColorsType, legacyCommonLightColors } from '../../common/theme/colors'

const themeColor = '#009684'
const themeColorLight = 'rgb(0, 150, 132, 0.5)'
const themeContrast = '#1A1A1A'

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
