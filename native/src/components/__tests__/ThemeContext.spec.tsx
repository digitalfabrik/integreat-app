import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useThemeContext } from '../../hooks/useThemeContext'
import renderWithTheme from '../../testing/render'
import { ThemeContainer } from '../ThemeContext'
import Text from '../base/Text'

jest.mock('@react-native-async-storage/async-storage')

const TestThemeTypeOnPress = () => {
  const { toggleTheme, themeType } = useThemeContext()
  return (
    <TouchableOpacity onPress={toggleTheme} accessibilityRole='button' accessibilityLabel='layout:contrastTheme'>
      <Text testID='theme-type'>{themeType}</Text>
    </TouchableOpacity>
  )
}

const toggleContrastTheme = (): RenderAPI =>
  renderWithTheme(
    <ThemeContainer>
      <TestThemeTypeOnPress />
    </ThemeContainer>,
  )

describe('ThemeContainer', () => {
  beforeEach(jest.clearAllMocks)

  it('render toggle button', () => {
    const { getByRole } = toggleContrastTheme()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    expect(toggleButton).toBeTruthy()
  })

  it('should load the light theme from AsyncStorage', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue('light')
    const { getByTestId } = toggleContrastTheme()

    const themeType = getByTestId('theme-type')
    expect(themeType).toHaveTextContent('light')
  })

  it('should load the contrast theme from AsyncStorage', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue('contrast')
    const { getByTestId } = toggleContrastTheme()
    const themeType = getByTestId('theme-type')

    await waitFor(() => {
      expect(themeType).toHaveTextContent('contrast')
    })
  })

  it('should toggle theme between light and contrast', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue('light')
    const { getByRole, getByTestId } = toggleContrastTheme()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    const themeType = getByTestId('theme-type')
    expect(themeType).toHaveTextContent('light')

    fireEvent.press(toggleButton)
    expect(themeType).toHaveTextContent('contrast')

    fireEvent.press(toggleButton)
    expect(themeType).toHaveTextContent('light')
  })

  it('should save the selected theme to AsyncStorage', async () => {
    ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue('light')
    const { getByRole } = toggleContrastTheme()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })

    fireEvent.press(toggleButton)
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'contrast')

    fireEvent.press(toggleButton)
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'light')
  })
})
