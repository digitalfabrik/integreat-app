import { fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import { useThemeContext } from '../../hooks/useThemeContext'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithTheme } from '../../testing/render'
import { mockWindowDimensions } from '../../testing/utils'
import ContrastThemeToggle from '../ContrastThemeToggle'
import { ThemeContainer } from '../ThemeContext'

jest.mock('../../hooks/useWindowDimensions', () => jest.fn(() => ({ viewportSmall: false })))
jest.mock('react-i18next')

const TestThemeTypeChange = () => {
  const { themeType } = useThemeContext()
  return <div>{themeType}</div>
}

const toggleContrastTheme = () =>
  renderWithTheme(
    <ThemeContainer contentDirection='ltr'>
      <>
        <ContrastThemeToggle />
        <TestThemeTypeChange />
      </>
    </ThemeContainer>,
  )

describe('ContrastThemeToggle', () => {
  beforeEach(jest.clearAllMocks)

  it('render toggle button in mobile view', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByRole } = toggleContrastTheme()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    expect(toggleButton).toBeInTheDocument()
  })

  it('toggles theme between light and contrast in mobile view', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByRole, getByText } = toggleContrastTheme()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    const themeType = getByText('light')
    expect(themeType).toHaveTextContent('light')

    fireEvent.click(toggleButton)
    expect(themeType).toHaveTextContent('contrast')

    fireEvent.click(toggleButton)
    expect(themeType).toHaveTextContent('light')
  })

  it('render toggle button in desktop view', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: false }))
    const { getByRole } = toggleContrastTheme()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    expect(toggleButton).toBeInTheDocument()
  })

  it('toggles theme between light and contrast in desktop view', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: false }))
    const { getByRole, getByText } = toggleContrastTheme()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    const themeType = getByText('light')
    expect(themeType).toHaveTextContent('light')

    fireEvent.click(toggleButton)
    expect(themeType).toHaveTextContent('contrast')

    fireEvent.click(toggleButton)
    expect(themeType).toHaveTextContent('light')
  })
})
