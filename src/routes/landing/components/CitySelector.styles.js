// @flow

import styled from 'styled-components'
import Link from 'redux-first-router-link'
import withPlatform from '../../../modules/platform/hocs/withPlatform'

export const CityListParent = withPlatform(styled.div`
  position: ${props => props.platform.positionStickyDisabled ? 'static' : 'sticky'};
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  transition: top 0.2s ease-out;
  background-color: white;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`)

export const CityListItem = styled(Link)`
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
