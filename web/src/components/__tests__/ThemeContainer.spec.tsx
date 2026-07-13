import { render } from '@testing-library/react'
import React from 'react'

import { THEME_STORAGE_KEY } from '../../hooks/useLocalStorage'
import ThemeContainer from '../ThemeContainer'

jest.mock('react-i18next')

describe('ThemeContainer', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('should process theme from query param into localStorage and remove it from the URL', () => {
    window.history.replaceState({}, '', '/test?theme=contrast')

    render(<ThemeContainer contentDirection='ltr'>{null}</ThemeContainer>)

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('"contrast"')
    expect(window.location.search).not.toContain('theme')
  })

  it('should not change localStorage when no theme query param is present', () => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('light'))
    window.history.replaceState({}, '', '/test')

    render(<ThemeContainer contentDirection='ltr'>{null}</ThemeContainer>)

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('"light"')
  })
})
