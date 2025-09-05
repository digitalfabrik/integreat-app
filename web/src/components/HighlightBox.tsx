import { styled } from '@mui/material/styles'

const HighlightBox = styled('div')`
  background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
  border-radius: 4px;
  padding: 20px;
  box-shadow:
    0 1px 3px rgb(0 0 0 / 10%),
    0 1px 2px rgb(0 0 0 / 15%);
`

export default HighlightBox
