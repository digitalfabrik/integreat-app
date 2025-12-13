import React, { ReactElement, useMemo } from 'react'
import { PaperProvider, configureFonts } from 'react-native-paper'
import { DefaultTheme, ThemeProvider } from 'styled-components/native'

import { commonNativeTypography } from 'build-configs/common/theme/typography'

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
  const fonts = configureFonts({ config: commonNativeTypography(legacyTheme.fonts) })
  return {
    dark: themeType === 'contrast',
    legacy: legacyTheme,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fonts: fonts as any,
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
      success: palette.success.main,
      tunews: {
        main: palette.tunews.main,
        light: palette.tunews.light,
      },
      ttsPlayer: {
        background: palette.ttsPlayer.background,
        playIconColor: palette.ttsPlayer.playIconColor,
      },
      action: {
        disabled: palette.action.disabled,
      },
      elevation: {
        level0: palette.tertiary.light,
        level1: palette.tertiary.light,
        level2: palette.tertiary.light,
        level3: palette.tertiary.light,
        level4: palette.tertiary.light,
        level5: palette.tertiary.light,
      },
    },
  }
}

const ThemeContainer = ({ children }: ThemeContainerProps): ReactElement => {
  const { settings } = useAppContext()
  const themeType = settings.selectedTheme

  const contextValue = useMemo(() => theme(themeType), [themeType])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <PaperProvider theme={contextValue as any}>
      <ThemeProvider theme={contextValue}>{children}</ThemeProvider>
    </PaperProvider>
  )
}

export default ThemeContainer
