import React from 'react'
import PropTypes from 'prop-types'
import Endpoint from './Endpoint'
import Error from '../common/containers/Error'

class EndpointProvider extends React.Component {
  static propTypes = {
    endpoints: PropTypes.arrayOf(PropTypes.instanceOf(Endpoint)).isRequired,
    children: PropTypes.element.isRequired
  }

  static childContextTypes = {
    getEndpoint: PropTypes.func.isRequired
  }

  getChildContext () {
    return {
      getEndpoint: (endpointName) => {
        const endpoint = this.endpoints[endpointName]
        if (!endpoint) {
          throw new Error('The endpoint ' + endpointName + ' was not found. Maybe you didn\'t wrap the ' +
            'withFetcher(...) call in a <EndpointProvider /> or the endpoint is not registered')
        }
        return endpoint
      }
    }
  }

  constructor (props, context) {
    super(props, context)
    this.endpoints = props.endpoints.reduce((accumulator, endpoint) => {
      accumulator[endpoint.stateName] = endpoint
      return accumulator
    }, {})
  }

  render () {
    return React.Children.only(this.props.children)
  }
}

export default EndpointProvider
