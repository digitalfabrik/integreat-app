import React from 'react'
import PropTypes from 'prop-types'

import style from './LocationSelector.css'
import { transform } from 'lodash/object'
import { Link } from 'redux-little-router'
import { groupBy, filter } from 'lodash/collection'
import LocationModel from 'modules/endpoint/models/LocationModel'

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
    language: PropTypes.string,
    stickyTop: PropTypes.number.isRequired
  }

  static defaultProps = {
    stickyTop: 0
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
      result.push(<div key={key}>
        <div className={style.languageListParent} style={{top: this.props.stickyTop + 'px'}}>{key}</div>
        {locations.map(location => <LocationEntry
          key={location.code}
          location={location}
          language={this.props.language} />)}
      </div>)
    }, [])
  }

  render () {
    return <React.Fragment>
      {
        this.renderList(this.filter())
      }
    </React.Fragment>
  }
}

export default LocationSelector
