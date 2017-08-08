import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import LocationFetcher from 'components/Fetcher/LocationFetcher'
import FilterableLocation from 'components/Location/FilterableLocation'

class LandingPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render () {
    return (
      <Layout>
        <LocationFetcher>
          <FilterableLocation locationCallback={(location) => {}}/>
        </LocationFetcher>
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{locations: {}}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return ({
    language: state.language.language
  })
}

export default connect(mapStateToProps)(LandingPage)
