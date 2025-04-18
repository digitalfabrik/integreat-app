import React, { createContext, ReactElement, useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'

type ThemeType = 'light' | 'contrast'

export type ThemeContextType = {
  theme: ReturnType<typeof buildConfig>['lightTheme'] | ReturnType<typeof buildConfig>['highContrastTheme']
  themeType: ThemeType
  toggleTheme: () => void
}

const themeConfig = buildConfig()

export const ThemeContext = createContext<ThemeContextType>({
  theme: themeConfig.lightTheme,
  themeType: 'light',
  toggleTheme: () => undefined,
})

export const contrastThemeMediaQueries = [
  '(forced-colors: active)' /* to detect enabled forced colors mode: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors */,
  '(prefers-contrast: more)' /* to detect a lower/higher contrast: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast */,
  '(prefers-color-scheme: dark)' /* is used to detect if a user has requested light or dark color themes: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme */,
].map(query => window.matchMedia(query))

const getSystemTheme = (): ThemeType => (contrastThemeMediaQueries.some(query => query.matches) ? 'contrast' : 'light')

type ThemeContainerProps = {
  children: ReactElement
  contentDirection: UiDirectionType
}

export const ThemeContainer = ({ children, contentDirection }: ThemeContainerProps): ReactElement => {
  const [themeType, setThemeType] = useState<ThemeType>(getSystemTheme)

  useEffect(() => {
    const updateTheme = () => setThemeType(getSystemTheme())

    updateTheme()

    contrastThemeMediaQueries.forEach(query => query.addEventListener('change', updateTheme))

    return () => {
      contrastThemeMediaQueries.forEach(query => query.removeEventListener('change', updateTheme))
    }
  }, [])

  const contextValue = useMemo(() => {
    const toggleTheme = () => {
      setThemeType(prev => (prev === 'light' ? 'contrast' : 'light'))
    }

    const baseTheme = themeType === 'contrast' ? themeConfig.highContrastTheme : themeConfig.lightTheme
    const theme = { ...baseTheme, contentDirection }
    return { theme, themeType, toggleTheme }
  }, [themeType, contentDirection])

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={contextValue.theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
