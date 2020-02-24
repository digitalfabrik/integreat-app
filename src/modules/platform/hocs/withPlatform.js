// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import PlatformContext from '../PlatformContext'
import Platform from '../Platform'

const withPlatform = <Props: { platform: Platform }>(
  WrappedComponent: React.AbstractComponent<Props>
): React.AbstractComponent<$Diff<Props, {| platform: Platform |}>> => {
  return class extends React.Component<$Diff<Props, {| platform: Platform |}>> {
    static displayName = wrapDisplayName(WrappedComponent, 'withPlatform')

    render () {
      return <PlatformContext.Consumer>
          {platform => <WrappedComponent {...this.props} platform={platform} />}
        </PlatformContext.Consumer>
    }
  }
}

export default withPlatform
