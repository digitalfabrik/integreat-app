// @flow

import * as React from 'react'
import type { NavigationScreenProp } from 'react-navigation'

function withNavigateAway<Props: {}> (
  Component: React.ComponentType<Props>
): React.ComponentType<$Diff<Props, { navigation: NavigationScreenProp<*> | void }>> {
  class MemoryDatabase extends React.PureComponent<Props> {
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

  return MemoryDatabase
}

export default withNavigateAway
