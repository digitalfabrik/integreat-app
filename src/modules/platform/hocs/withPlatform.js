// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import PlatformContext from '../PlatformContext'
import Platform from '../Platform'

const withPlatform = <Props: {}>(WrappedComponent: React.ComponentType<Props>): React.ComponentType<$Diff<Props,
  {| platform: Platform | void |}>> => {
  return class extends React.Component<Props> {
    static displayName = wrapDisplayName(WrappedComponent, 'withPlatform')

    render () {
      return <PlatformContext.Consumer>
          {platform => <WrappedComponent platform={platform} {...this.props} />}
        </PlatformContext.Consumer>
    }
  }
}

export default withPlatform
