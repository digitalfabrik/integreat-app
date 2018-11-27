// @flow

import React from 'react'
import Highlighter from 'react-highlighter'

import { CityModel } from '@integreat-app/integreat-api-client'
import styled from 'styled-components'
import Link from 'redux-first-router-link'
import CategoriesRouteConfig from '../../../modules/app/route-configs/CategoriesRouteConfig'

const CityListItem = styled(Link)`
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

type PropsType = {|
  language: string,
  city: CityModel,
  filterText: string
|}

class CityEntry extends React.PureComponent<PropsType> {
  render () {
    const {city, language, filterText} = this.props
    return (
      <CityListItem to={new CategoriesRouteConfig().getRoutePath({city: city.code, language})}>
        <Highlighter search={filterText}>
          {city.name}
        </Highlighter>
      </CityListItem>
    )
  }
}

export default CityEntry
