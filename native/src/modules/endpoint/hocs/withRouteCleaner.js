// @flow

import * as React from 'react'
import type { NavigationStackProp } from 'react-navigation-stack'

/**
 * This hoc removes routes from the state when unmounting
 *
 * @param Component
 * @returns {RouteCleaner}
 */
function withRouteCleaner<Props: { navigation: NavigationStackProp<*> }> (
  Component: React.ComponentType<Props>
): React.ComponentType<Props> {
  class RouteCleaner extends React.Component<Props> {
    componentWillUnmount () {
      const onRouteClose = this.props.navigation.getParam('onRouteClose')
      if (!onRouteClose) {
        throw new Error('onRouteClose is not provided to route in the navigation props!')
      }
      onRouteClose()
    }

    render () {
      return <Component {...this.props} />
    }
  }

  return RouteCleaner
}

export default withRouteCleaner
