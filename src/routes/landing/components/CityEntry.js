// @flow

import React from 'react'
import Highlighter from 'react-highlighter'

import { CityListItem } from './CitySelector.styles'
import { goToCategories } from '../../../modules/app/routes/categories'
import CityModel from '../../../modules/endpoint/models/CityModel'

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
