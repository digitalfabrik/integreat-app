// @flow

import React from 'react'
import type { Node } from ' react'

import Platform from '../Platform'
import PlatformContext from '../PlatformContext'

class Provider extends React.Component<{ children: Node }> {
  constructor () {
    super()
    this.platform = new Platform()
  }

  render () {
    return <PlatformContext.Provider value={this.platform}>
      {this.props.children}
    </PlatformContext.Provider>
  }
}

export default { Consumer: PlatformContext.Consumer, Provider }
