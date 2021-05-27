import * as React from 'react'
import Platform from '../context/Platform'
import PlatformContext from '../context/PlatformContext'

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
