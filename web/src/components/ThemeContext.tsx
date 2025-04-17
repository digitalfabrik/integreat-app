import React, { createContext, ReactElement, useCallback, useEffect, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'
import { contrastThemeMediaQueries } from '../constants/contrastThemeMediaQueries'
import useLocalStorage from '../hooks/useLocalStorage'

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

const getSystemTheme = (): ThemeType => (contrastThemeMediaQueries.some(query => query.matches) ? 'contrast' : 'light')

type ThemeContainerProps = {
  children: ReactElement
  contentDirection: UiDirectionType
}

export const ThemeContainer = ({ children, contentDirection }: ThemeContainerProps): ReactElement => {
  const { value: themeType, updateLocalStorageItem: setThemeType } = useLocalStorage<ThemeType>({
    key: 'themeType',
    initialValue: getSystemTheme(),
  })

  useEffect(() => {
    const handleSystemChange = () => {
      const storedTheme = localStorage.getItem('themeType')
      if (!storedTheme || storedTheme === 'null') {
        const currentTheme = getSystemTheme()
        setThemeType(currentTheme)
      }
    }

    handleSystemChange()

    contrastThemeMediaQueries.forEach(query => query.addEventListener('change', handleSystemChange))

    return () => {
      contrastThemeMediaQueries.forEach(query => query.removeEventListener('change', handleSystemChange))
    }
  }, [setThemeType])

  const toggleTheme = useCallback(() => {
    const currentTheme = themeType === 'light' ? 'contrast' : 'light'
    setThemeType(currentTheme)
  }, [themeType, setThemeType])

  const contextValue = useMemo(() => {
    const baseTheme = themeType === 'contrast' ? themeConfig.highContrastTheme : themeConfig.lightTheme
    const theme = { ...baseTheme, contentDirection }
    return { theme, themeType, toggleTheme }
  }, [themeType, contentDirection, toggleTheme])

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={contextValue.theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
