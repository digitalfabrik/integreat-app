import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout/index'
import FilterableLocation from 'components/Location/FilterableLocation'

import LOCATION_ENDPOINT, { LocationModel } from 'endpoints/location'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(LocationModel))).isRequired,
    language: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LOCATION_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(LOCATION_ENDPOINT.fetchEndpointAction())
  }

  render () {
    return (
      <Layout noHeader={true} currentLanguage={this.props.language}>
        <FilterableLocation locations={this.props.locations} locationCallback={(location) => {}}/>
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
