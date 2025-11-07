import 'styled-components/native'

import { LegacyThemeType } from 'build-configs/LegacyThemeType'

// Temporary type definition until react-native-paper is installed
type MD3Theme = {
  dark: boolean
  legacy: LegacyThemeType & { isContrastTheme: boolean }
  colors: {
    primary: string
    primaryContainer: string
    secondary: string
    secondaryContainer: string
    tertiary: string
    tertiaryContainer: string
    surface: string
    surfaceVariant: string
    surfaceDisabled: string
    background: string
    error: string
    errorContainer: string
    onPrimary: string
    onPrimaryContainer: string
    onSecondary: string
    onSecondaryContainer: string
    onTertiary: string
    onTertiaryContainer: string
    onSurface: string
    onSurfaceVariant: string
    onSurfaceDisabled: string
    onError: string
    onErrorContainer: string
    onBackground: string
    outline: string
    outlineVariant: string
  }
}

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends MD3Theme {}
}
