import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import Fetcher from 'components/Fetcher'
import FilterableLocation from 'components/Location/FilterableLocation'

import LOCATION_ENDPOINT from 'endpoints/location'
import LocationModel from 'endpoints/models/LocationModel'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(LocationModel))).isRequired,
    language: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render () {
    return (
      <Layout>
        <Fetcher endpoint={LOCATION_ENDPOINT}>
          <FilterableLocation locations={this.props.locations} locationCallback={(location) => {}}/>
        </Fetcher>
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{locations: {}}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  let locations = state.locations.data
  return ({
    locations: locations || {},
    language: state.language.language
  })
}

export default connect(mapStateToProps)(LandingPage)
