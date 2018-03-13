import React from 'react'
import PropTypes from 'prop-types'

import style from './LocationSelector.css'
import { transform } from 'lodash/object'
import { groupBy, filter } from 'lodash/collection'
import LocationModel from 'modules/endpoint/models/LocationModel'
import LocationEntry from './LocationEntry'

class LocationSelector extends React.PureComponent {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)),
    filterText: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    stickyTop: PropTypes.number.isRequired
  }

  static defaultProps = {
    stickyTop: 0
  }

  filter () {
    const filterText = this.props.filterText.toLowerCase()
    let locations = this.props.locations

    if (filterText === 'wirschaffendas') {
      return filter(locations, location => !location.live)
    }

    locations = filter(locations, location => location.live)

    return filter(locations, location => location.name.toLowerCase().includes(filterText))
  }

  renderList (locations) {
    const groups = groupBy(locations, location => location.sortCategory)
    return transform(groups, (result, locations, key) => {
      result.push(<div key={key}>
        <div className={style.locationListParent} style={{top: `${this.props.stickyTop}px`}}>{key}</div>
        {locations.map(location => <LocationEntry
          key={location.code}
          location={location}
          language={this.props.language}
          filterText={this.props.filterText} />)}
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
