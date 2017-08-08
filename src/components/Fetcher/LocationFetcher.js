import React from 'react'
import { connect } from 'react-redux'

import LOCATION_FETCHER from 'endpoints/location'

class LocationFetcher extends React.Component {
  componentWillUnmount () {
    this.props.dispatch(LOCATION_FETCHER.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(LOCATION_FETCHER.fetchEndpointAction())
  }

  render () {
    return React.cloneElement(React.Children.only(this.props.children), {locations: this.props.locationPayload.data})
  }
}

export default connect((state) => { return {locationPayload: state.locations} })(LocationFetcher)
