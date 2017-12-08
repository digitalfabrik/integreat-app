import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LOCATIONS_ENDPOINT from 'modules/endpoint/endpoints/location'
import FilterableLocationSelector from 'routes/landing/components/FilterableLocationSelector'
import Footer from 'modules/app/containers/Footer'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LocationModel from 'modules/endpoint/models/LocationModel'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <FilterableLocationSelector
          language={this.props.language}
          locations={this.props.locations}/>
        <Footer/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params && state.router.params.language ? state.router.params.language : 'de'
})

export default compose(
  connect(mapStateToProps),
  withFetcher(LOCATIONS_ENDPOINT)
)(LandingPage)
