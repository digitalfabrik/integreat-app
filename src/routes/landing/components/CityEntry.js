// @flow

import React from 'react'
import Highlighter from 'react-highlight-words'
import normalize from '../../../modules/common/utils/normalize'

import { CityModel } from '@integreat-app/integreat-api-client'
import styled from 'styled-components'
import Link from 'redux-first-router-link'
import CategoriesRouteConfig from '../../../modules/app/route-configs/CategoriesRouteConfig'

const CityListItem = styled(Link)`
  display: flex;
  flex-direction: column;
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

const AliasItem = styled(Highlighter)`
  display: inline-block;
  font-size: 12px;

  &:not(:last-child):after {
    content: ',\\00a0';
    font-size: 12px;
  }
`

type PropsType = {|
  language: string,
  city: CityModel,
  filterText: string
|}

class CityEntry extends React.PureComponent<PropsType> {
  getMatchedAliases = (city: CityModel, normalizedFilter: string): Array<CityModel> => {
    if (city.aliases && normalizedFilter.length >= 2) {
      return Object.keys(city.aliases)
        .filter(alias => normalize(alias).includes(normalizedFilter))
    }
    return []
  }

  render () {
    const { city, language, filterText } = this.props
    const normalizedFilter = normalize(filterText)
    const aliases = this.getMatchedAliases(city, normalizedFilter)

    return (
      <CityListItem to={new CategoriesRouteConfig().getRoutePath({ city: city.code, language })}>
        <Highlighter searchWords={[filterText]} sanitize={normalize}
                     textToHighlight={city.name} />
        <div style={{ margin: '0 5px' }}>
          {
            aliases.map(alias => (
              <AliasItem key={alias} searchWords={[filterText]} sanitize={normalize}
                         textToHighlight={alias} />
            ))
          }
        </div>
      </CityListItem>
    )
  }
}

export default CityEntry
