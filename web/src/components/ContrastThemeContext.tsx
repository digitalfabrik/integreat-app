import React, { createContext, ReactElement, useCallback, useEffect, useState } from 'react'

type ContrastThemeProviderProps = {
  children: ReactElement
}

export type ContrastThemeContextType = {
  isContrastTheme: boolean
  toggleContrastTheme: () => void
}

export const ContrastThemeContext = createContext<ContrastThemeContextType>({
  isContrastTheme: false,
  toggleContrastTheme: () => {},
})

const getSystemPreference = (): boolean => {
  const forcedColors = window.matchMedia('(forced-colors: active)')
  const prefersContrast = window.matchMedia('(prefers-contrast: more)')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  return forcedColors.matches || prefersContrast.matches || prefersDark.matches
}

export const ContrastThemeProvider = ({ children }: ContrastThemeProviderProps): ReactElement => {
  const [isContrastTheme, setIsContrastTheme] = useState<boolean>(false)
  const [overrideEnabled, setOverrideEnabled] = useState<boolean>(false)

  useEffect(() => {
    const handleSystemChange = () => {
      if (!overrideEnabled) {
        const currentSystemPreference = getSystemPreference()
        setIsContrastTheme(currentSystemPreference)
      }
    }

    handleSystemChange()

    const queries = [
      window.matchMedia('(forced-colors: active)'),
      window.matchMedia('(prefers-contrast: more)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
    ]

    queries.forEach(query => query.addEventListener('change', handleSystemChange))
    return () => {
      queries.forEach(query => query.removeEventListener('change', handleSystemChange))
    }
  }, [overrideEnabled])

  const toggleContrastTheme = useCallback(() => {
    const currentOverrideState = !overrideEnabled
    setOverrideEnabled(currentOverrideState)

    if (currentOverrideState) {
      setIsContrastTheme(prev => !prev)
    } else {
      setIsContrastTheme(getSystemPreference())
    }
  }, [overrideEnabled, isContrastTheme])

  return (
    <ContrastThemeContext.Provider value={{ isContrastTheme: isContrastTheme ?? false, toggleContrastTheme }}>
      {children}
    </ContrastThemeContext.Provider>
  )
}
