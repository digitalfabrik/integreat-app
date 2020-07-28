// @flow

import styled from 'styled-components'
import CleanAnchor from '../../common/components/CleanAnchor'

export const StyledToolbarItem = styled(CleanAnchor)`
  display: inline-block;
  margin: 0 10px;
  padding: 8px;
  cursor: pointer;
  border: none;
  color: ${props => props.theme.colors.textColor};
  background-color: ${props => props.theme.colors.backgroundColor};
  text-align: center;
`
export const SmallViewTip = styled.p`
  display: block;
  font-size: 12px;
  font-weight: bold;
`
