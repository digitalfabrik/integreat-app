import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash/lang'

import style from './style.css'
import { transform } from 'lodash/object'
import { Link } from 'redux-little-router'

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
    let location = this.props.location
    return (
      <Link href={`/${this.props.language}${location.path}location`} className={style.languageListItem}>
        <div>{location.name}</div>
      </Link>
    )
  }
}

class Location extends React.Component {
  static propTypes = {
    locations: PropTypes.object,
    filterText: PropTypes.string.isRequired,
    language: PropTypes.string
  }

  filter (locations) {
    let filter = this.props.filterText.toLowerCase()

    if (filter === 'wirschaffendas') {
      return locations.filter((location) => !location.live)
    }

    locations = locations.filter((location) => location.live)

    return locations.filter((location) => location.name.toLowerCase().includes(filter))
  }

  renderList (locations) {
    return transform(locations, (result, locations, key) => {
      locations = this.filter(locations)

      if (isEmpty(locations)) {
        return
      }

      let parent = <LocationParentEntry key={key} name={key}/>
      let locationEntries = locations.map((location, index) => <LocationEntry location={location}
                                                                              key={key + index}
                                                                              language={this.props.language}/>)

      result.push(parent)
      result.push(locationEntries)
    }, [])
  }

  render () {
    return (
      <div>
        <div className={style.languageList}>
          {
            this.renderList(this.props.locations)
          }
        </div>
      </div>
    )
  }
}

export default Location
