// @flow

import React from 'react'
import type { ComponentType } from ' react'
import { wrapDisplayName } from 'recompose'

import PlatformContext from '../PlatformContext'

const withPlatform = (WrappedComponent: ComponentType) => {
  return class extends React.Component {
    static displayName = wrapDisplayName(WrappedComponent, 'withPlatform')

    render () {
      return <PlatformContext.Consumer>
        {platform => <WrappedComponent {...{...this.props, platform}} />}
      </PlatformContext.Consumer>
    }
  }
}

export default withPlatform
