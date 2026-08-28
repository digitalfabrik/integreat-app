import Chip, { chipClasses } from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import { render } from '@testing-library/react'
import React from 'react'

import { THEME_STORAGE_KEY } from '../../hooks/useLocalStorage'
import ThemeContainer from '../ThemeContainer'

const TestChild = () => {
  const { isContrastTheme } = useTheme()
  return <span>{isContrastTheme ? 'contrast' : 'light'}</span>
}

const renderThemeContainer = () =>
  render(
    <ThemeContainer contentDirection='ltr'>
      <TestChild />
    </ThemeContainer>,
  )

describe('ThemeContainer', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('should prefer the theme query param over the stored theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('light'))
    window.history.replaceState({}, '', '/test?theme=contrast')

    const { getByText } = renderThemeContainer()

    expect(getByText('contrast')).toBeInTheDocument()
  })

  it('should fall back to the stored theme when no theme query param is present', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('contrast'))
    window.history.replaceState({}, '', '/test')

    const { getByText } = renderThemeContainer()

    expect(getByText('contrast')).toBeInTheDocument()
  })

  it('should keep outlined chips visible on keyboard focus', () => {
    const { getByRole } = render(
      <ThemeContainer contentDirection='ltr'>
        <Chip label='Filter locations' variant='outlined' clickable />
      </ThemeContainer>,
    )
    const chip = getByRole('button', { name: 'Filter locations' })

    chip.classList.add(chipClasses.focusVisible)

    expect(getComputedStyle(chip).backgroundColor).toBe('rgb(255, 255, 255)')
  })
})
