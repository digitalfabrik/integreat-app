import { legacyCommonContrastColors, LegacyColorsType, legacyCommonLightColors } from '../../common/theme/colors'

const themeColor = '#fbda16'
const themeColorLight = 'rgb(251, 218, 22, 0.5)'
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
