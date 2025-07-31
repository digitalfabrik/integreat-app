import createCache from '@emotion/cache'
import { CacheProvider, Global, Theme, ThemeProvider } from '@emotion/react'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import rtlPlugin from '@mui/stylis-plugin-rtl'
import React, { ReactElement, ReactNode, useMemo } from 'react'
import { prefixer } from 'stylis'

import { ThemeKey } from 'build-configs'
import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'
import globalStyle from '../styles/global/GlobalStyle'
import { muiShadowCreator } from '../utils/muiShadowCreator'

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
): Omit<Theme, 'toggleTheme'> => {
  const isContrast = themeType === 'contrast'

  return {
    ...(isContrast ? buildConfig().legacyContrastTheme : buildConfig().legacyLightTheme),
    contentDirection,
    isContrastTheme: isContrast,
    ...createMuiTheme({
      breakpoints: {
        values: BREAKPOINTS,
      },
      direction: contentDirection,
      colorSchemes: {
        light: buildConfig().lightTheme,
        dark: buildConfig().darkTheme,
      },
      shadows: muiShadowCreator(themeType),
      typography: buildConfig().typography,
      palette: isContrast ? buildConfig().darkTheme.palette : buildConfig().lightTheme.palette,
      components: {
        MuiIconButton: {
          styleOverrides: {
            root: {
              variants: [
                {
                  props: { color: 'default' },
                  style: {
                    color: themeType === 'contrast' ? '#FFFFFF' : '#212121',

                    '&:disabled': {
                      color: themeType === 'contrast' ? '#333D51' : '#8E8E8E',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    }),
  }
}

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
