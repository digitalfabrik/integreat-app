import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import CleanAnchor from './CleanAnchor'

const StyledToolbarItem = styled(CleanAnchor)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
  cursor: pointer;
  border: none;
  color: ${props => props.theme.colors.textColor};
  background-color: transparent;
  text-align: center;

  @media ${dimensions.smallViewport} {
    line-height: 1.15;
  }
`

export default StyledToolbarItem
