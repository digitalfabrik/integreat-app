import createCache from '@emotion/cache'
import { CacheProvider, Global, Theme } from '@emotion/react'
import { createTheme as createMuiTheme, ThemeProvider } from '@mui/material/styles'
import rtlPlugin from '@mui/stylis-plugin-rtl'
import React, { ReactElement, ReactNode, useMemo } from 'react'
import { prefixer } from 'stylis'

import { ThemeKey } from 'build-configs'
import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'
import globalStyle from '../styles/global/GlobalStyle'

const ltrCache = createCache({
  key: 'mui-ltr-cache',
  stylisPlugins: [prefixer],
})

const rtlCache = createCache({
  key: 'mui-rtl-cache',
  stylisPlugins: [prefixer, rtlPlugin],
})

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 840,
  lg: 1200,
  xl: 1600,
}

const createTheme = (
  themeType: 'light' | 'contrast',
  contentDirection: UiDirectionType,
): Omit<Theme, 'toggleTheme'> => ({
  ...(themeType === 'contrast' ? buildConfig().legacyContrastTheme : buildConfig().legacyLightTheme),
  contentDirection,
  isContrastTheme: themeType === 'contrast',
  ...createMuiTheme({
    breakpoints: {
      values: BREAKPOINTS,
    },
    direction: contentDirection,
    colorSchemes: {
      light: buildConfig().lightTheme,
      dark: buildConfig().darkTheme,
    },
    typography: buildConfig().typography,
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
    <CacheProvider value={contentDirection === 'rtl' ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyle({ theme })} />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}

export default ThemeContainer
