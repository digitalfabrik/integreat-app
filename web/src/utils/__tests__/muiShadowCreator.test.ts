import { MUI_SHADOW_ARRAY_LENGTH, muiShadowCreator } from '../muiShadowCreator'

describe('muiShadowCreator', () => {
  it('should return an array of shadows with the correct length', () => {
    const themeType = 'light'
    const result = muiShadowCreator(themeType)
    expect(result).toHaveLength(MUI_SHADOW_ARRAY_LENGTH)
  })

  it('should return none for first shadow element', () => {
    const themeType = 'light'
    const result = muiShadowCreator(themeType)
    expect(result[0]).toBe('none')
  })

  it('should create shadows with the correct RGB color and shadow for light mode starting at index 1', () => {
    const themeType = 'light'
    const result = muiShadowCreator(themeType)
    for (let index = 1; index < MUI_SHADOW_ARRAY_LENGTH; index += 1) {
      expect(result[index]).toBe(
        `0px 3px 3px -2px rgb(0, 0, 0, ${index / (MUI_SHADOW_ARRAY_LENGTH - 1)}), 0px 3px 4px 0px rgb(0, 0, 0, ${index / (MUI_SHADOW_ARRAY_LENGTH - 1)}), 0px 1px 8px 0px rgb(0, 0, 0, ${index / (MUI_SHADOW_ARRAY_LENGTH - 1)})`,
      )
    }
  })

  it('should create shadows with the correct RGB color and shadow for contrast mode starting at index 1', () => {
    const themeType = 'contrast'
    const result = muiShadowCreator(themeType)
    for (let index = 1; index < MUI_SHADOW_ARRAY_LENGTH; index += 1) {
      expect(result[index]).toBe(
        `0px 3px 3px -2px rgb(255, 255, 255, ${index / (MUI_SHADOW_ARRAY_LENGTH - 1)}), 0px 3px 4px 0px rgb(255, 255, 255, ${index / (MUI_SHADOW_ARRAY_LENGTH - 1)}), 0px 1px 8px 0px rgb(255, 255, 255, ${index / (MUI_SHADOW_ARRAY_LENGTH - 1)})`,
      )
    }
  })
})
