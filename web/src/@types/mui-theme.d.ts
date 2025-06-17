/* eslint-disable @typescript-eslint/no-unused-vars */
import { TypographyPropsVariantOverrides } from '@mui/material/Typography'

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
    h4: false
    h5: false
    h6: false
  }
}
