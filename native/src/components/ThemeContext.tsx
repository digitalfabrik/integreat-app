import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useColorScheme } from 'react-native'
import { ThemeProvider } from 'styled-components/native'

import { ThemeType, ThemeKey } from 'build-configs/index'

import buildConfig from '../constants/buildConfig'
import { reportError } from '../utils/sentry'

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

const STORAGE_KEY = 'theme'

export const ThemeContainer = ({ children }: ThemeContainerProps): ReactElement => {
  const systemTheme = useColorScheme()
  const [themeType, setThemeType] = useState<ThemeKey>('light')

  useEffect(() => {
    ;(async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY)
        if (savedTheme === 'light' || savedTheme === 'contrast') {
          setThemeType(savedTheme as ThemeKey)
        } else {
          setThemeType(systemTheme === 'dark' ? 'contrast' : 'light')
        }
      } catch (error) {
        reportError(error)
        setThemeType(systemTheme === 'dark' ? 'contrast' : 'light')
      }
    })()
  }, [systemTheme])

  const toggleTheme = useCallback(() => {
    setThemeType(prev => {
      const chosenTheme = prev === 'light' ? 'contrast' : 'light'
      AsyncStorage.setItem(STORAGE_KEY, chosenTheme).catch(error => reportError(error))
      return chosenTheme
    })
  }, [])

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
