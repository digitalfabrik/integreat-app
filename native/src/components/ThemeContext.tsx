import React, { createContext, ReactElement, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components/native'

import { ThemeType, ThemeKey } from 'build-configs/index'

import buildConfig from '../constants/buildConfig'

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
  const [themeType, setThemeType] = useState<ThemeKey>('light')

  const contextValue = useMemo(() => {
    const toggleTheme = () => {
      setThemeType(prev => (prev === 'light' ? 'contrast' : 'light'))
    }

    const baseTheme = themeType === 'contrast' ? themeConfig.contrastTheme : themeConfig.lightTheme
    const theme = { ...baseTheme, isContrastTheme: themeType === 'contrast' }
    return { theme, themeType, toggleTheme }
  }, [themeType])

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={contextValue.theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
