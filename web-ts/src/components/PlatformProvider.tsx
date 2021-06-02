import * as React from 'react'
import PlatformContext, { Platform } from '../contexts/PlatformContext'

type PropsType = {
  children: React.ReactNode
}

class Provider extends React.Component<PropsType> {
  platform: Platform

  constructor(props: PropsType) {
    super(props)
    this.platform = new Platform()
  }

  render() {
    return <PlatformContext.Provider value={this.platform}>{this.props.children}</PlatformContext.Provider>
  }
}

export default Provider
