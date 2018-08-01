// @flow

import * as React from 'react'
import { wrapDisplayName } from 'recompose'

import PlatformContext from '../PlatformContext'
import Platform from '../Platform'

const withPlatform = (WrappedComponent: React.ComponentType<*>) => {
  return class extends React.Component<{ platform?: Platform }> {
    static displayName = wrapDisplayName(WrappedComponent, 'withPlatform')

    render () {
      return <PlatformContext.Consumer>
        {platform => {
          if (!platform) {
            throw new Error('Component needs to be wrapped into a withPlatform')
          }

          return <WrappedComponent {...this.props} platform={platform} />
        }}
      </PlatformContext.Consumer>
    }
  }
}

export default withPlatform
