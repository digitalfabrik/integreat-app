import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'
import { contrastThemeMediaQueries } from '../constants/contrastThemeMediaQueries'

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
  const [themeType, setThemeType] = useState<ThemeType>(() => getSystemTheme())

  useEffect(() => {
    const handleSystemChange = () => {
      const systemTheme = getSystemTheme()
      setThemeType(prev => (prev !== systemTheme ? systemTheme : prev))
    }

    handleSystemChange()

    contrastThemeMediaQueries.forEach(query => query.addEventListener('change', handleSystemChange))

    return () => {
      contrastThemeMediaQueries.forEach(query => query.removeEventListener('change', handleSystemChange))
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeType(prev => (prev === 'light' ? 'contrast' : 'light'))
  }, [])

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
