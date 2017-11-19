import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LOCATIONS_ENDPOINT from 'endpoints/location'
import FilterableLocationSelector from 'components/FilterableLocationSelector/index'
import Footer from 'components/RichLayout/Footer'
import withFetcher from 'endpoints/withFetcher'
import LocationModel from 'endpoints/models/LocationModel'

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
