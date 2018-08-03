// @flow

import * as React from 'react'
import { Text } from 'react-native-elements'
import PlatformContext from '../../platform/PlatformContext'
import Platform from '../../platform/Platform'
import LayoutContainer from '../../layout/container/LayoutContainer'
import Navigator from './Navigator'

class App extends React.Component<{}> {
  platform: Platform

  constructor () {
    super()
    this.platform = new Platform()
  }

  render () {
    return (
      <PlatformContext.Provider value={this.platform}>
        <LayoutContainer>
          <Navigator />
        </LayoutContainer>
      </PlatformContext.Provider>
    )
  }
}

export default App
