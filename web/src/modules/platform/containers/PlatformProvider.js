// @flow

import * as React from 'react'

import Platform from '../Platform'
import PlatformContext from '../PlatformContext'

type PropsType = {|
  children: React.Node
|}

class Provider extends React.Component<PropsType> {
  platform: Platform
  constructor() {
    super()
    this.platform = new Platform()
  }

  render() {
    return <PlatformContext.Provider value={this.platform}>{this.props.children}</PlatformContext.Provider>
  }
}

export default Provider
