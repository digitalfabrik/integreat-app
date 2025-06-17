declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface TypographyVariants {
    body3: React.CSSProperties
  }

  // allow configuration using `createTheme()`
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface TypographyPropsVariantOverrides {
    body3: true
  }
}
