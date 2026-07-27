import { css, SerializedStyles } from '@emotion/react'
import { Theme } from '@mui/material/styles'

import { bottomSheetHandleHeight } from '../../hooks/useDimensions'

const GlobalStyle = ({ theme }: { theme: Theme }): SerializedStyles => css`
  body {
    margin: 0;
    position: relative;

    /* stylelint-disable selector-class-pattern */

    /* react-spring-bottom-sheet */
    --rsbs-bg: ${theme.palette.background.default};

    [data-rsbs-header] {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      min-height: ${bottomSheetHandleHeight}px;
      box-shadow: none;
    }

    [data-rsbs-header]::before {
      content: none;
    }

    [data-rsbs-content] {
      min-height: 100%;
      display: flex;
    }

    [data-rsbs-overlay] {
      min-height: ${bottomSheetHandleHeight}px;
    }
  }
`
export default GlobalStyle
