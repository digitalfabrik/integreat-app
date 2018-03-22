import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FilterableLocationSelector from 'routes/landing/components/FilterableLocationSelector'
import CityModel from 'modules/endpoint/models/CityModel'

export class LandingPage extends React.Component {
  static propTypes = {
    cities: PropTypes.arrayOf(PropTypes.instanceOf(CityModel)).isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return <FilterableLocationSelector
          language={this.props.language}
          cities={this.props.cities} />
  }
}

const mapStateToProps = state => ({
  language: state.location.payload.language,
  cities: state.cities.data
})

export default connect(mapStateToProps)(LandingPage)
