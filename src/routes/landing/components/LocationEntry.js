import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'redux-little-router'

import style from './LocationSelector.css'

class LocationEntry extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired
  }

  render () {
    const {location, language} = this.props
    return (
      <Link href={`/${location.code}/${language}`} className={style.languageListItem}>{location.name}</Link>
    )
  }
}

export default LocationEntry
