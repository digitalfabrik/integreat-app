import React from 'react'
import Spinner from 'react-spinkit'
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
    if (this.props.locationPayload.ready()) {
      return React.cloneElement(React.Children.only(this.props.children), {locations: this.props.locationPayload.data})
    } else {
      return <Spinner name='line-scale-party'/>
    }
  }
}

export default connect((state) => { return {locationPayload: state.locations} })(LocationFetcher)
