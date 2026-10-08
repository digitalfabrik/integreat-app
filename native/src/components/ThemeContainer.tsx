import React, { ReactElement, useMemo } from 'react'
import { configureFonts, PaperProvider } from 'react-native-paper'
import { DefaultTheme, ThemeProvider } from 'styled-components/native'

import { ThemeType } from 'shared'

import buildConfig from '../constants/buildConfig'
import { prepareTypography } from '../constants/typography'
import { useAppContext } from '../hooks/useRegionAppContext'

type ThemeContainerProps = {
  children: ReactElement
}

export const theme = (themeType: ThemeType): DefaultTheme => {
  const palette = themeType === 'contrast' ? buildConfig().darkTheme.palette : buildConfig().lightTheme.palette

  return {
    dark: themeType === 'contrast',
    fonts: configureFonts({ config: prepareTypography(buildConfig().fonts) }),
    colors: {
      primary: palette.primary.main,
      primaryContainer: palette.primary.main,
      secondary: palette.secondary.main,
      secondaryContainer: palette.secondary.light,
      tertiary: palette.tertiary.main,
      tertiaryContainer: palette.tertiary.light,
      tertiaryDark: palette.tertiary.dark,
      surface: palette.background.default,
      surfaceVariant: palette.background.accent,
      surfaceDisabled: palette.action.disabledBackground,
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
      onSurfaceVariant: palette.text.primary,
      onSurfaceDisabled: palette.action.disabled,
      inverseSurface: palette.text.primary,
      inverseOnSurface: palette.background.default,
      inversePrimary: palette.primary.contrastText,
      onError: palette.error.contrastText,
      onErrorContainer: palette.error.contrastText,
      onBackground: palette.text.primary,
      outline: palette.primary.main,
      outlineVariant: palette.text.secondary,
      success: palette.success.main,
      tuNews: {
        main: palette.tuNews.main,
        contrastText: palette.tuNews.contrastText,
      },
      amalNews: {
        main: palette.amalNews.main,
        contrastText: palette.amalNews.contrastText,
      },
      action: {
        disabled: palette.action.disabled,
      },
      elevation: {
        level0: 'transparent',
        level1: palette.background.paper,
        level2: palette.background.paper,
        level3: palette.background.accent,
        level4: palette.background.accent,
        level5: palette.background.accent,
      },
    },
  }
}

const ThemeContainer = ({ children }: ThemeContainerProps): ReactElement => {
  const { settings } = useAppContext()
  const themeType = settings.selectedTheme

  const contextValue = useMemo(() => theme(themeType), [themeType])

  return (
    <ThemeProvider theme={contextValue}>
      <PaperProvider theme={contextValue}>{children}</PaperProvider>
    </ThemeProvider>
  )
}

export default ThemeContainer
