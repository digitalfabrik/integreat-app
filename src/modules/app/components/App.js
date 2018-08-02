// @flow

import * as React from 'react'
import { Text } from 'react-native-elements'
import PlatformContext from '../../platform/PlatformContext'
import Platform from '../../platform/Platform'
import LayoutContainer from '../../layout/container/LayoutContainer'

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
          <Text>Text</Text>
        </LayoutContainer>
      </PlatformContext.Provider>
    )
  }
}

export default App
