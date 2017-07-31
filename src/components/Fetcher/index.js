import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LANGUAGE_ENDPOINT from 'endpoints/language'
import Endpoint from 'endpoints/Endpoint'

class Fetcher extends React.Component {
  static propTypes = {
    endpoint: PropTypes.instanceOf(Endpoint).isRequired,
    urlOptions: PropTypes.object,
    transformOptions: PropTypes.object
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(this.props.endpoint.fetchEndpointAction(this.props.urlOptions, this.props.transformOptions))
  }

  render () {
    // todo render children only if endpoint is finished with fetching
    // return React.Children.only(this.props.children)
    return <div>{this.props.children}</div>
  }
}

export default connect()(Fetcher)
