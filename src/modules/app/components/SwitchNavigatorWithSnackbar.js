// @flow

import React from 'react'
import type { NavigationNavigator, NavigationScreenProp } from 'react-navigation'

type PropsType = {|
  navigation: NavigationScreenProp<*>
|}

const createSwitchNavigatorWithSnackbar = (
  // $FlowFixMe
  SwitchNavigator: NavigationNavigator<*, *, *>
): NavigationNavigator<*, *, *> => {
  class SwitchNavigatorWithSnackbar extends React.Component<PropsType> {
    static router = SwitchNavigator.router
    static navigationOptions = SwitchNavigator.navigationOptions

    render () {
      const navigation = this.props

      // $FlowFixMe
      return <SwitchNavigator navigation={navigation} />
    }
  }

  return SwitchNavigatorWithSnackbar
}

export default createSwitchNavigatorWithSnackbar
