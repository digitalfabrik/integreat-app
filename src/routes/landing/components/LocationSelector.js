import React from 'react'
import PropTypes from 'prop-types'

import { LocationListParent } from './LocationSelector.styles'
import { transform } from 'lodash/object'
import { groupBy } from 'lodash/collection'
import CityModel from 'modules/endpoint/models/CityModel'
import LocationEntry from './LocationEntry'

class LocationSelector extends React.PureComponent {
  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.instanceOf(CityModel)),
    filterText: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    stickyTop: PropTypes.number.isRequired
  }

  static defaultProps = {
    stickyTop: 0
  }

  filter () {
    const filterText = this.props.filterText.toLowerCase()
    const cities = this.props.cities

    if (filterText === 'wirschaffendas') {
      return cities.filter(_city => !_city.live)
    } else {
      return cities
        .filter(_city => _city.live)
        .filter(_city => _city.name.toLowerCase().includes(filterText))
    }
  }

  renderList (locations) {
    const groups = groupBy(locations, location => location.sortCategory)
    return transform(groups, (result, locations, key) => {
      result.push(<div key={key}>
        <LocationListParent style={{top: `${this.props.stickyTop}px`}}>{key}</LocationListParent>
        {locations.map(location => <LocationEntry
          key={location.code}
          city={location}
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
