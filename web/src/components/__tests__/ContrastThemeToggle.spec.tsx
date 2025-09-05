import { useTheme } from '@mui/material/styles'
import { fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { renderWithTheme } from '../../testing/render'
import { mockWindowDimensions } from '../../testing/utils'
import ContrastThemeToggle from '../ContrastThemeToggle'

jest.mock('../../hooks/useWindowDimensions', () => jest.fn(() => ({ viewportSmall: false })))
jest.mock('react-i18next')

const TestThemeTypeChange = () => {
  const theme = useTheme()
  return <div>{theme.isContrastTheme ? 'contrast' : 'light'}</div>
}

const renderContrastThemeToggle = () =>
  renderWithTheme(
    <>
      <ContrastThemeToggle />
      <TestThemeTypeChange />
    </>,
  )

describe('ContrastThemeToggle', () => {
  beforeEach(jest.clearAllMocks)

  it('render toggle button in mobile view', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByRole } = renderContrastThemeToggle()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    expect(toggleButton).toBeInTheDocument()
  })

  it('toggles theme between light and contrast in mobile view', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: true }))
    const { getByRole, getByText } = renderContrastThemeToggle()
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
    const { getByRole } = renderContrastThemeToggle()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    expect(toggleButton).toBeInTheDocument()
  })

  it('toggles theme between light and contrast in desktop view', () => {
    mocked(useWindowDimensions).mockImplementation(() => ({ ...mockWindowDimensions, viewportSmall: false }))
    const { getByRole, getByText } = renderContrastThemeToggle()
    const toggleButton = getByRole('button', { name: 'layout:contrastTheme' })
    const themeType = getByText('light')
    expect(themeType).toHaveTextContent('light')

    fireEvent.click(toggleButton)
    expect(themeType).toHaveTextContent('contrast')

    fireEvent.click(toggleButton)
    expect(themeType).toHaveTextContent('light')
  })
})
