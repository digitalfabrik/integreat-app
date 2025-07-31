import { Shadows } from '@mui/material/styles/shadows'

/** This function creates a shadow array for the MUI theme that respects light and dark mode.
 * It creates all 25 shadows from 0-1 opacity to display different intensity shadows. */
export const MUI_SHADOW_ARRAY_LENGTH = 25
const RGB_COLOR_BLACK = 0
const RGB_COLOR_WHITE = 255
export const muiShadowCreator = (themeType: 'light' | 'contrast'): Shadows => {
  const shadowRGBColor = themeType === 'contrast' ? RGB_COLOR_WHITE : RGB_COLOR_BLACK
  return Array(MUI_SHADOW_ARRAY_LENGTH)
    .fill('none')
    .map((_, index) => {
      if (index === 0) {
        return 'none'
      }
      const color = `rgba(${shadowRGBColor}, ${shadowRGBColor}, ${shadowRGBColor}, ${index / (MUI_SHADOW_ARRAY_LENGTH - 1)})`
      return `0px 3px 3px -2px ${color}, 0px 3px 4px 0px ${color}, 0px 1px 8px 0px ${color}`
    }) as Shadows
}
