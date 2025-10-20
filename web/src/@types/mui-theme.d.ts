/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { PaletteColor, Palette, PaletteOptions, TypeBackground } from '@mui/material/styles'

import { Dimensions } from '../hooks/useDimensions'

// Enable and disable typography variants according to our design system
// docs: https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    contentDirection: UiDirectionType
    isContrastTheme: boolean
    toggleTheme: () => void
    dimensions: Dimensions
  }

  interface ThemeOptions {
    contentDirection: UiDirectionType
    isContrastTheme: boolean
  }

  interface TypeBackground {
    accent: string
  }

  interface Palette {
    tertiary: PaletteColor
    tunews: {
      light: string
      main: string
    }
  }

  interface PaletteOptions {
    tertiary: PaletteColor
    tunews: {
      light: string
      main: string
    }
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true
  }

  interface ButtonOwnProps {
    onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void
  }
}

declare module '@mui/material/ToggleButton' {
  interface ToggleButtonPropsColorOverrides {
    tertiary: true
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    tertiary: true
  }
}
