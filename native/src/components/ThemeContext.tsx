import React, { createContext, ReactElement, useCallback, useMemo } from 'react'
import { ThemeProvider } from 'styled-components/native'

import { ThemeType, ThemeKey } from 'build-configs/index'

import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'

export type ThemeContextType = {
  theme: ThemeType
  themeType: ThemeKey
  toggleTheme: () => void
}

const themeConfig = buildConfig()

export const ThemeContext = createContext<ThemeContextType>({
  theme: themeConfig.lightTheme,
  themeType: 'light',
  toggleTheme: () => undefined,
})

type ThemeContainerProps = {
  children: ReactElement
}

export const ThemeContainer = ({ children }: ThemeContainerProps): ReactElement => {
  const { settings, updateSettings } = useAppContext()
  const themeType = settings.selectedTheme

  const toggleTheme = useCallback(() => {
    const newTheme: ThemeKey = themeType === 'light' ? 'contrast' : 'light'
    updateSettings({ selectedTheme: newTheme })
  }, [themeType, updateSettings])

  const contextValue = useMemo(() => {
    const baseTheme = themeType === 'contrast' ? themeConfig.contrastTheme : themeConfig.lightTheme
    const theme = { ...baseTheme, isContrastTheme: themeType === 'contrast' }
    return { theme, themeType, toggleTheme }
  }, [themeType, toggleTheme])

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={contextValue.theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
