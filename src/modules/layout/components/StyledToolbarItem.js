// @flow

import styled from 'styled-components'
import CleanAnchor from '../../common/components/CleanAnchor'

const StyledToolbarItem = styled(CleanAnchor)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.textColor};
  border: none;
  background-color: ${props => props.theme.colors.backgroundColor};
`

export default StyledToolbarItem
