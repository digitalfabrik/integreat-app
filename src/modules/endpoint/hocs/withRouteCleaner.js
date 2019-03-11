// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'

/**
 * This hoc removes routes from the state when unmounting
 *
 * @param Component
 * @returns {RouteCleaner}
 */
function withRouteCleaner<Props: { navigation: NavigationScreenProp<*> }> (
  Component: React.ComponentType<Props>
): React.ComponentType<Props> {
  class RouteCleaner extends React.PureComponent<Props> {
    componentWillUnmount () {
      this.props.navigation.getParam('onDidBlur')()
    }

    componentDidMount () {
      // const didBlurSubscription = this.props.navigation.addListener(
      //   'didBlur',
      //   payload => {
      //     this.props.navigation.getParam('onDidBlur')()
      //     didBlurSubscription.remove()
      //   }
      // )
    }

    render () {
      return <Component {...this.props} />
    }
  }

  return RouteCleaner
}

export default withRouteCleaner
