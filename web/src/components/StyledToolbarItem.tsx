import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import Link from './base/Link'

const StyledToolbarItem = styled(Link).attrs(() => ({
  isCleanAnchor: true,
}))`
  display: inline-block;
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
