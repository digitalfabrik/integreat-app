import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash/lang'

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
    let location = this.props.location
    return (
      <Link href={`/${location.code}/${this.props.language}`} className={style.languageListItem}>{location.name}</Link>
    )
  }
}

class Location extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)),
    filterText: PropTypes.string.isRequired,
    language: PropTypes.string
  }

  filter (locations) {
    let filterText = this.props.filterText.toLowerCase()

    if (filterText === 'wirschaffendas') {
      return filter(locations, (location) => !location.live)
    }

    locations = filter(locations, (location) => location.live)

    return filter(locations, (location) => location.name.toLowerCase().includes(filterText))
  }

  renderList (locations) {
    const groups = groupBy(locations, location => location.sortCategory)
    return transform(groups, (result, locations, key) => {
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
            this.renderList(this.filter(this.props.locations))
          }
        </div>
      </div>
    )
  }
}

export default Location
