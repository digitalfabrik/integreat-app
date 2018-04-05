import PropTypes from 'prop-types'
import React from 'react'
import Link from 'redux-first-router-link'
import Highlighter from 'react-highlighter'

import style from './LocationSelector.css'
import { goToCategories } from '../../../modules/app/routes/categories'
import CityModel from '../../../modules/endpoint/models/CityModel'

class LocationEntry extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string.isRequired,
    city: PropTypes.instanceOf(CityModel).isRequired,
    filterText: PropTypes.string
  }

  render () {
    const {city, language, filterText} = this.props
    return (
      <Link to={goToCategories(city.code, language)} className={style.locationListItem}>
        <Highlighter search={filterText || ''}>
          {city.name}
        </Highlighter>
      </Link>
    )
  }
}

export default LocationEntry
