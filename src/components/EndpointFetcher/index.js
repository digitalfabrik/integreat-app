import React from 'react'
import PropTypes from 'prop-types'

import LANGUAGE_ENDPOINT from 'endpoints/language'
import Endpoint from 'endpoints/Endpoint'
import { connect } from 'react-redux'

class EndpointFetcher extends React.Component {
  static propTypes = {
    endpoint: PropTypes.instanceOf(Endpoint).isRequired,
    urlOptions: PropTypes.object.isRequired,
    transformOptions: PropTypes.object
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(this.props.endpoint.fetchEndpointAction(this.props.urlOptions, this.props.transformOptions))
  }

  render () {
    return <div>{this.props.children}</div>
  }
}

export default connect()(EndpointFetcher)
