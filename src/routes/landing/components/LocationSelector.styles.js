import styled from 'styled-components'
import Link from 'redux-first-router-link'

import { positionStickyDisabled } from '../../../modules/common/constants'

export const LocationListParent = styled.div`
  position: ${positionStickyDisabled ? 'static' : 'sticky'};
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  transition: top 0.2s ease-out;
  background-color: white;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

export const LocationListItem = styled(Link)`
  display: block;
  padding: 7px;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    color: inherit;
    text-decoration: inherit;
    transition: background-color 0.5s ease;
    background-color: ${props => props.theme.colors.backgroundAccentColor};
  }
`
