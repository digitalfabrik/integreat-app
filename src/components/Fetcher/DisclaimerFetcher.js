import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class DisclaimerFetcher extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(DISCLAIMER_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(DISCLAIMER_ENDPOINT.fetchEndpointAction({
      location: this.props.location,
      language: this.props.language,
      since: BIRTH_OF_UNIVERSE
    }, {
      location: this.props.location
    }))
  }

  render () {
    return React.cloneElement(React.Children.only(this.props.children), {disclaimerPayload: this.props.disclaimerPayload})
  }
}

export default connect((state) => { return {disclaimerPayload: state.disclaimer} })(DisclaimerFetcher)
