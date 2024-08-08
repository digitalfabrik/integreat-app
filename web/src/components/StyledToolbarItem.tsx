import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import CleanAnchor from './CleanAnchor'

const StyledToolbarItem = styled(CleanAnchor)<{ disabled?: boolean }>`
  display: inline-block;
  padding: 8px;
  cursor: pointer;
  /* pointer-events: ${props => (props.disabled ? 'none' : null)}; */
  border: none;
  color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textColor)};
  background-color: transparent;
  text-align: center;

  @media ${dimensions.smallViewport} {
    line-height: 1.15;
  }
`

export default StyledToolbarItem
