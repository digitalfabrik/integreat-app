import React from 'react'
import PropTypes from 'prop-types'

import style from './style.css'
import { transform } from 'lodash/object'
import { Link } from 'redux-little-router'
import { groupBy, filter } from 'lodash/collection'
import LocationModel from '../../endpoints/models/LocationModel'

class LocationParentEntry extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className={style.languageListParent}>{this.props.name}</div>
    )
  }
}

class LocationEntry extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    location: PropTypes.object.isRequired
  }

  render () {
    const location = this.props.location
    return (
      <Link href={`/${location.code}/${this.props.language}`} className={style.languageListItem}>{location.name}</Link>
    )
  }
}

class LocationSelector extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)),
    filterText: PropTypes.string.isRequired,
    language: PropTypes.string
  }

  filter () {
    const filterText = this.props.filterText.toLowerCase()
    let locations = this.props.locations

    if (filterText === 'wirschaffendas') {
      return filter(locations, (location) => !location.live)
    }

    locations = filter(locations, (location) => location.live)

    return filter(locations, (location) => location.name.toLowerCase().includes(filterText))
  }

  renderList (locations) {
    const groups = groupBy(locations, location => location.sortCategory)
    return transform(groups, (result, locations, key) => {
      result.push(<LocationParentEntry key={key} name={key}/>)
      result.push(locations.map((location, index) => <LocationEntry key={key + index}
                                                                    location={location}
                                                                    language={this.props.language}/>))
    }, [])
  }

  render () {
    return (
      <div>
        <div className={style.languageList}>
          {
            this.renderList(this.filter())
          }
        </div>
      </div>
    )
  }
}

export default LocationSelector
