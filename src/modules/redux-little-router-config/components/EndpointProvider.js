import React from 'react'
import PropTypes from 'prop-types'
import RouteConfig from '../RouteConfig'

class EndpointProvider extends React.Component {
  static propTypes = {
    routeConfig: PropTypes.instanceOf(RouteConfig).isRequired,
    children: PropTypes.element.isRequired
  }

  static childContextTypes = {
    matchRoute: PropTypes.func.isRequired
  }

  getChildContext () {
    return {
      matchRoute: (id) => this.props.routeConfig.matchRoute(id)
    }
  }

  render () {
    return React.Children.only(this.props.children)
  }
}

export default EndpointProvider
