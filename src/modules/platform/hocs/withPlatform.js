// @flow

import React from 'react'
import type { ComponentType } from ' react'

import PlatformContext from '../PlatformContext'

const withPlatform = (WrappedComponent: ComponentType) => {
  return props => <PlatformContext.Consumer>
    {platform => <WrappedComponent {...{...props, platform}} />}
  </PlatformContext.Consumer>
}

export default withPlatform
