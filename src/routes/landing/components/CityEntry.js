// @flow

import React from 'react'
import Highlighter from 'react-highlighter'

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
const MunicipalityItem = styled(Highlighter)`
  font-size: 12px;
`
type PropsType = {|
  language: string,
  city: CityModel,
  filterText: string
|}

class CityEntry extends React.PureComponent<PropsType> {
  render () {
    const { city, language, filterText } = this.props
    const getMunicipality = (city, filterText): Array<CityModel> => {
      if (!filterText) {
        return []
      }
      if (city._aliases) {
        const municipalities = Object.keys(city._aliases).map(municipality => municipality.toLowerCase())
        const municipalityMatch = municipalities.filter(municipality => municipality.includes(filterText.toLowerCase()))
        const municipalityMatchCapitalized = municipalityMatch.map(match => match[0].toUpperCase() + match.slice(1))
        return municipalityMatchCapitalized
      }
      return []
    }
    const municipalities = getMunicipality(city, filterText)
    return (
      <CityListItem to={new CategoriesRouteConfig().getRoutePath({ city: city.code, language })}>
        <Highlighter search={filterText}>
          {city.name}
        </Highlighter>
        {
          municipalities.map(municipality => (
            <MunicipalityItem key={municipality} search={filterText}>
              {municipality}
            </MunicipalityItem>
          ))
        }
      </CityListItem>
    )
  }
}

export default CityEntry
