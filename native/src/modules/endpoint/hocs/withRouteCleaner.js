// @flow

import * as React from 'react'
import type { RoutePropType, RoutesType } from '../../app/components/NavigationTypes'

/**
 * This hoc removes routes from the state when unmounting
 *
 * @param Component
 * @returns {RouteCleaner}
 */
function withRouteCleaner<Props: { route: RoutePropType<RoutesType>, ... }> (
  Component: React.ComponentType<Props>
): React.ComponentType<Props> {
  class RouteCleaner extends React.Component<Props> {
    componentWillUnmount () {
      const { params } = this.props.route
      const onRouteClose = params.onRouteClose ? params.onRouteClose : null
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
