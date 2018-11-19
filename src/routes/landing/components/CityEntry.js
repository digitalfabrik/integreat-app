// @flow

import React from 'react'
import Highlighter from 'react-highlighter'

import { goToCategories } from '../../../modules/app/routes/categories'
import CityModel from '../../../modules/endpoint/models/CityModel'
import styled from 'styled-components'
import Link from 'redux-first-router-link'

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
      <CityListItem to={goToCategories(city.code, language)}>
        <Highlighter search={filterText}>
          {city.name}
        </Highlighter>
      </CityListItem>
    )
  }
}

export default CityEntry
