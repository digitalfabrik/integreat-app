import React, { ReactElement, useMemo } from 'react'
import { DefaultTheme, ThemeProvider } from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'

type ThemeContainerProps = {
  children: ReactElement
}

export const theme = (themeType: 'light' | 'contrast'): DefaultTheme => {
  const legacyTheme =
    themeType === 'contrast'
      ? { ...buildConfig().legacyContrastTheme, isContrastTheme: true }
      : { ...buildConfig().legacyLightTheme, isContrastTheme: false }

  const palette = themeType === 'contrast' ? buildConfig().darkTheme.palette : buildConfig().lightTheme.palette
  return {
    dark: themeType === 'contrast',
    legacy: legacyTheme,
    colors: {
      primary: palette.primary.main,
      primaryContainer: palette.primary.light,
      secondary: palette.secondary.main,
      secondaryContainer: palette.secondary.light,
      tertiary: palette.tertiary.main,
      tertiaryContainer: palette.tertiary.light,
      surface: palette.background.default,
      surfaceVariant: palette.background.accent,
      surfaceDisabled: palette.background.default,
      background: palette.background.default,
      error: palette.error.main,
      errorContainer: palette.error.light,
      onPrimary: palette.primary.contrastText,
      onPrimaryContainer: palette.primary.contrastText,
      onSecondary: palette.secondary.contrastText,
      onSecondaryContainer: palette.secondary.contrastText,
      onTertiary: palette.tertiary.contrastText,
      onTertiaryContainer: palette.tertiary.contrastText,
      onSurface: palette.text.primary,
      onSurfaceVariant: palette.text.secondary,
      onSurfaceDisabled: palette.text.disabled,
      onError: palette.error.contrastText,
      onErrorContainer: palette.error.contrastText,
      onBackground: palette.text.primary,
      outline: palette.text.primary,
      outlineVariant: palette.text.secondary,
    },
  }
}

const ThemeContainer = ({ children }: ThemeContainerProps): ReactElement => {
  const { settings } = useAppContext()
  const themeType = settings.selectedTheme

  const contextValue = useMemo(() => theme(themeType), [themeType])

  return <ThemeProvider theme={contextValue}>{children}</ThemeProvider>
}

export default ThemeContainer
