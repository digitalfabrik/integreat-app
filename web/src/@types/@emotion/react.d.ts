import '@emotion/react'
import { Theme as MuiTheme } from '@mui/material/styles'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme extends MuiTheme {}
}
