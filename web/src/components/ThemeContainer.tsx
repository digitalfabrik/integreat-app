import createCache from '@emotion/cache'
import { CacheProvider, Global } from '@emotion/react'
import { createTheme as createMuiTheme, Theme, ThemeProvider } from '@mui/material/styles'
import rtlPlugin from '@mui/stylis-plugin-rtl'
import React, { ReactElement, ReactNode, useMemo } from 'react'
import { prefixer } from 'stylis'

import { ThemeKey } from 'build-configs'
import { UiDirectionType } from 'translations'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
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
  const theme = isContrast ? buildConfig().darkTheme : buildConfig().lightTheme

  return createMuiTheme({
    legacy: isContrast ? buildConfig().legacyContrastTheme : buildConfig().legacyLightTheme,
    contentDirection,
    isContrastTheme: isContrast,
    breakpoints: {
      values: BREAKPOINTS,
    },
    direction: contentDirection,
    shadows: muiShadowCreator(themeType),
    typography: buildConfig().typography,
    palette: theme.palette,
    components: {
      MuiTypography: {
        defaultProps: {
          dir: 'auto',
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            background: 'transparent',
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            background: 'transparent',
          },
        },
      },
      MuiAccordionSummary: {
        defaultProps: {
          disableRipple: false,
        },
      },
      MuiChip: {
        styleOverrides: {
          filled: {
            backgroundColor: theme.palette.surface.main,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
          slotProps: {
            tooltip: {
              dir: 'auto',
            },
          },
        },
        styleOverrides: {
          popper: {
            padding: '8px',
          },
          arrow: {
            color: theme.palette.primary.main,
          },
          tooltip: {
            backgroundColor: theme.palette.primary.main,
            fontSize: buildConfig().typography.label1?.fontSize,
            padding: '8px 16px',
          },
        },
      },
    },
  })
}

type ThemeContainerProps = {
  children: ReactNode
  contentDirection: UiDirectionType
}

const ThemeContainer = ({ children, contentDirection }: ThemeContainerProps): ReactElement => {
  const dimensions = useDimensions()
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
    document.body.style.backgroundColor = theme.palette.surface.main
    return { ...theme, toggleTheme }
  }, [themeType, setThemeType, contentDirection])

  return (
    <CacheProvider value={contentDirection === 'rtl' ? rtlCache : ltrCache}>
      <ThemeProvider theme={{ ...theme, dimensions }}>
        <Global styles={globalStyle({ theme })} />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}

export default ThemeContainer
