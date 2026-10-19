import { CommonColorPalette } from 'build-configs/ThemeType'

import { createAlertColors, darken, lighten } from '../colors'

describe('colors', () => {
  it('should lighten colors like mui', () => {
    expect(lighten('#4CAF50', 0.9)).toBe('#EDF7ED')
    expect(lighten('#EF5350', 0.9)).toBe('#FDEDED')
    expect(lighten('#81C784', 0.6)).toBe('#CCE8CD')
    expect(lighten('#FFF', 0.5)).toBe('#FFFFFF')
  })

  it('should darken colors like mui', () => {
    expect(darken('#4CAF50', 0.6)).toBe('#1E4620')
    expect(darken('#EF5350', 0.6)).toBe('#5F2120')
    expect(darken('#81C784', 0.9)).toBe('#0C130D')
    expect(darken('#000', 0.5)).toBe('#000000')
  })

  it('should create the alert colors like mui', () => {
    const color = { light: '#4CAF50', main: '#2E7D32', dark: '#1B5E20', contrastText: '#FFFFFF' }
    const palette = { success: color, info: color, warning: color, error: color }

    expect(createAlertColors({ ...palette, mode: 'light' } as CommonColorPalette).success).toEqual({
      icon: '#2E7D32',
      background: '#EDF7ED',
      text: '#1E4620',
    })
    expect(createAlertColors({ ...palette, mode: 'dark' } as CommonColorPalette).error).toEqual({
      icon: '#2E7D32',
      background: '#071107',
      text: '#B7DFB9',
    })
  })
})
