import { Global, ThemeProvider } from '@emotion/react'
import React, { createContext, ReactElement, useMemo } from 'react'

import { LegacyThemeType, ThemeKey } from 'build-configs'
import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'
import globalStyle from '../styles/global/GlobalStyle'

export type ThemeContextType = {
  theme: LegacyThemeType
  themeType: ThemeKey
  toggleTheme: () => void
}

const themeConfig = buildConfig()

export const ThemeContext = createContext<ThemeContextType>({
  theme: themeConfig.legacyLightTheme,
  themeType: 'light',
  toggleTheme: () => undefined,
})

// For now, we want the dark mode to be opt in as it is a beta feature for now
// const contrastThemeMediaQueries = [
//   '(forced-colors: active)' /* to detect enabled forced colors mode: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors */,
//   '(prefers-contrast: more)' /* to detect a lower/higher contrast: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast */,
//   '(prefers-color-scheme: dark)' /* is used to detect if a user has requested light or dark color themes: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme */,
// ].map(query => window.matchMedia(query))
//
// const getSystemTheme = (): ThemeKey => (contrastThemeMediaQueries.some(query => query.matches) ? 'contrast' : 'light')

type ThemeContainerProps = {
  children: ReactElement
  contentDirection: UiDirectionType
}

export const ThemeContainer = ({ children, contentDirection }: ThemeContainerProps): ReactElement => {
  const { value: themeType, updateLocalStorageItem: setThemeType } = useLocalStorage<ThemeKey>({
    key: 'theme',
    initialValue: 'light',
  })

  const contextValue = useMemo(() => {
    const toggleTheme = () => {
      const currentTheme = themeType === 'light' ? 'contrast' : 'light'
      setThemeType(currentTheme)
    }

    const baseTheme = themeType === 'contrast' ? themeConfig.legacyContrastTheme : themeConfig.legacyLightTheme
    // Set body overflow color (visible on scroll to start/end)
    document.body.style.backgroundColor = baseTheme.colors.backgroundAccentColor
    const theme = { ...baseTheme, contentDirection, isContrastTheme: themeType === 'contrast' }
    return { theme, themeType, toggleTheme }
  }, [themeType, setThemeType, contentDirection])

  return (
    <ThemeContext.Provider value={contextValue}>
      <Global styles={globalStyle({ theme: contextValue.theme })} />
      <ThemeProvider theme={contextValue.theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
