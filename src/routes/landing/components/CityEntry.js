import PropTypes from 'prop-types'
import React from 'react'
import Highlighter from 'react-highlighter'

import { CityListItem } from './CitySelector.styles'
import { goToCategories } from '../../../modules/app/routes/categories'
import CityModel from '../../../modules/endpoint/models/CityModel'

class CityEntry extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string.isRequired,
    city: PropTypes.instanceOf(CityModel).isRequired,
    filterText: PropTypes.string
  }

  render () {
    const {city, language, filterText} = this.props
    return (
      <CityListItem to={goToCategories(city.code, language)}>
        <Highlighter search={filterText || ''}>
          {city.name}
        </Highlighter>
      </CityListItem>
    )
  }
}

export default CityEntry
