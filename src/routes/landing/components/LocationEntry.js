import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'redux-little-router'
import Highlighter from 'react-highlighter'

import style from './LocationSelector.css'

class LocationEntry extends React.PureComponent {
  static propTypes = {
    language: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    filterText: PropTypes.string
  }

  render () {
    const {location, language, filterText} = this.props
    return (
      <Link href={`/${location.code}/${language}`} className={style.locationListItem}>
        <Highlighter search={filterText || ''}>
          {location.name}
        </Highlighter>
      </Link>
    )
  }
}

export default LocationEntry
