// @flow

import { type NavigationScreenProp } from 'react-navigation'
import { wrapDisplayName } from 'recompose'
import * as React from 'react'

export default <S: { navigation: NavigationScreenProp<*> }> (
  Component: React.ComponentType<$Diff<S, { navigation: NavigationScreenProp<*> }>>
): React.ComponentType<S> => {
  return class extends React.Component<{ ...S, navigation: NavigationScreenProp<*> }> {
    static displayName = wrapDisplayName(Component, 'omitNavigation')

    render () {
      const { navigation, ...rest } = this.props
      return <Component {...rest} />
    }
  }
}
