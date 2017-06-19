import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout/Layout'
import FilterableLocation from 'components/Location/FilterableLocation'

import { fetchEndpoint } from 'endpoints/endpoint'
import LOCATION_ENDPOINT, { LocationModel } from 'endpoints/location'

import NAVIGATION from 'navigation'
import Payload from 'payload'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(LocationModel))).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LOCATION_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(fetchEndpoint(LOCATION_ENDPOINT))
  }

  render () {
    return (
      <Layout languageCallback={(code) => { /* todo */ }}
              languagePayload={new Payload()}
              navigation={NAVIGATION}
              noHeader={true}>
        <FilterableLocation locations={this.props.locations} locationCallback={(location) => console.log(location)}/>
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
    locations: locations || {}
  })
}

export default connect(mapStateToProps)(LandingPage)
