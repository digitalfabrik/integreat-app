import { css, SerializedStyles } from '@emotion/react'
import { Theme } from '@mui/material/styles'

const GlobalStyle = ({ theme }: { theme: Theme }): SerializedStyles => css`
  body {
    position: relative;

    /* stylelint-disable selector-class-pattern */

    /* react-spring-bottom-sheet */

    [data-rsbs-header] {
      background-color: ${theme.palette.background.default};
      box-shadow: none;
      padding-top: calc(24px + env(safe-area-inset-top));
    }

    [data-rsbs-header]::before {
      background-color: ${theme.palette.text.primary};
      width: 28px;
      height: 4px;
      top: calc(18px + env(safe-area-inset-top));
    }

    [data-rsbs-has-header='false'] [data-rsbs-header] {
      padding-top: calc(32px + env(safe-area-inset-top));
    }

    [data-rsbs-content] {
      min-height: 100%;
      display: flex;
    }

    [data-rsbs-overlay] {
      min-height: 40px;
    }

    [data-rsbs-scroll='true'] {
      background-color: ${theme.palette.background.default};
    }
  }
`
export default GlobalStyle
