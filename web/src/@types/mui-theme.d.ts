/* eslint-disable @typescript-eslint/no-unused-vars */
import { TypographyPropsVariantOverrides } from '@mui/material/Typography'
import { PaletteColor, Palette, PaletteOptions } from '@mui/material/styles'

// Enable and disable typography variants according to our design system
// docs: https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants
declare module '@mui/material/Typography' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Palette {
    tertiary: PaletteColor
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface PaletteOptions {
    tertiary?: PaletteColor
  }
}
