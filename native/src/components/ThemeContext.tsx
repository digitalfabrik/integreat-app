import React, { ReactElement, useMemo } from 'react'
import { ThemeProvider } from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'

type ThemeContainerProps = {
  children: ReactElement
}

export const ThemeContainer = ({ children }: ThemeContainerProps): ReactElement => {
  const { settings } = useAppContext()
  const themeType = settings.selectedTheme

  const contextValue = useMemo(() => {
    const theme =
      themeType === 'contrast'
        ? { ...buildConfig().legacyContrastTheme, isContrastTheme: true }
        : { ...buildConfig().legacyLightTheme, isContrastTheme: false }
    return { theme }
  }, [themeType])

  return <ThemeProvider theme={contextValue.theme}>{children}</ThemeProvider>
}
