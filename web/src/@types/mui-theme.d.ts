/* eslint-disable no-magic-numbers */

/* eslint-disable @typescript-eslint/consistent-type-definitions */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { TypographyPropsVariantOverrides } from '@mui/material/Typography'

// Enable and disable typography variants according to our design system
// docs: https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true
    display2: true
    display3: true
    title1: true
    title2: true
    title3: true
    body3: true
    label1: true
    label2: true
    label3: true
    chip1: true
    chip2: true
    chip3: true
    textLink: true
    h4: false
    h5: false
    h6: false
    subtitle1: false
    subtitle2: false
    caption: false
    overline: false
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      1000?: string
      900: string
      800: string
      700: string
      600: string
      500: string
      400: string
      300: string
      200: string
      100: string
      50: string
    }
  }

  interface PaletteOptions {
    neutral: {
      1000?: string
      900: string
      800: string
      700: string
      600: string
      500: string
      400: string
      300: string
      200: string
      100: string
      50: string
    }
  }
}
