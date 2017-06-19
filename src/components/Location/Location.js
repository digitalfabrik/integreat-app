import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash/lang'

import style from './Location.css'
import { transform } from 'lodash/object'

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
    location: PropTypes.object,
    locationCallback: PropTypes.func
  }

  render () {
    let location = this.props.location
    return (
      <Link to={'/location' + this.props.path}
            className={style.languageListItem}
            onClick={() => this.props.locationCallback(location.path, location.name)}>
        <div>{location.name}</div>
      </Link>
    )
  }
}

class Location extends React.Component {
  static propTypes = {
    locations: PropTypes.object,
    filterText: PropTypes.string,
    locationCallback: PropTypes.func
  }

  filter (locations) {
    let filter = this.props.filterText.toLowerCase()
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
                                                                              locationCallback={this.props.locationCallback}/>)

      result.push(parent)
      result.push(locationEntries)
    }, [])
  }

  render () {
    return (
      <div>
        <div className={style.languageList}>
          {
            isEmpty(this.props.locations) ? <Spinner className={style.loading} name='line-scale-party'/>
              : this.renderList(this.props.locations)
          }
        </div>
      </div>
    )
  }
}

export default Location
