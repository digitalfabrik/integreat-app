import { Global, Theme, ThemeProvider } from '@emotion/react'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import React, { ReactElement, ReactNode, useMemo } from 'react'

import { ThemeKey } from 'build-configs'
import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'
import globalStyle from '../styles/global/GlobalStyle'

// For now, we want the dark mode to be opt in as it is a beta feature for now
// const contrastThemeMediaQueries = [
//   '(forced-colors: active)' /* to detect enabled forced colors mode: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors */,
//   '(prefers-contrast: more)' /* to detect a lower/higher contrast: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast */,
//   '(prefers-color-scheme: dark)' /* is used to detect if a user has requested light or dark color themes: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme */,
// ].map(query => window.matchMedia(query))
//
// const getSystemTheme = (): ThemeKey => (contrastThemeMediaQueries.some(query => query.matches) ? 'contrast' : 'light')

const createTheme = (
  themeType: 'light' | 'contrast',
  contentDirection: UiDirectionType,
): Omit<Theme, 'toggleTheme'> => ({
  ...(themeType === 'contrast' ? buildConfig().legacyContrastTheme : buildConfig().legacyLightTheme),
  contentDirection,
  isContrastTheme: themeType === 'contrast',
  ...createMuiTheme({
    colorSchemes: {
      light: buildConfig().lightTheme,
      dark: buildConfig().darkTheme,
    },
  }),
})

type ThemeContainerProps = {
  children: ReactNode
  contentDirection: UiDirectionType
}

const ThemeContainer = ({ children, contentDirection }: ThemeContainerProps): ReactElement => {
  const { value: themeType, updateLocalStorageItem: setThemeType } = useLocalStorage<ThemeKey>({
    key: 'theme',
    initialValue: 'light',
  })

  const theme: Theme = useMemo(() => {
    const toggleTheme = () => {
      const currentTheme = themeType === 'light' ? 'contrast' : 'light'
      setThemeType(currentTheme)
    }

    const theme = createTheme(themeType, contentDirection)
    document.body.style.backgroundColor = theme.colors.backgroundAccentColor
    return { ...theme, toggleTheme }
  }, [themeType, setThemeType, contentDirection])

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyle({ theme })} />
      {children}
    </ThemeProvider>
  )
}

export default ThemeContainer
