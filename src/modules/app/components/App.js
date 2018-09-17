// @flow

import * as React from 'react'
import PlatformContext from '../../platform/PlatformContext'
import Platform from '../../platform/Platform'

import { Provider } from 'react-redux'
import I18nProvider from 'modules/i18n/containers/I18nProvider'
import createReduxStore from '../createReduxStore'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'
import IOSSafeAreaView from 'modules/platform/components/IOSSafeAreaView'
import AndroidStatusBarContainer from '../../platform/containers/AndroidStatusBarContainer'
import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'
import RNFetchblob from 'rn-fetch-blob'
import { WebView } from 'react-native-webview'
import styled from 'styled-components'

const WebContainer = styled.View`
  flex: 1;
  height: 500px;
`

class App extends React.Component<{}, { waitingForStore: boolean }> {
  platform: Platform

  store: Store<StateType, StoreActionType>

  constructor () {
    super()
    this.state = {waitingForStore: true}
    const storeConfig = createReduxStore(() => { this.setState({waitingForStore: false}) }, false)
    this.store = storeConfig.store
    this.platform = new Platform()

    const session = RNFetchblob.session()
    RNFetchblob.config({
      path: `${RNFetchblob.fs.dirs.DocumentDir}/red.png`
    })
      .fetch('GET', 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Solid_red.png', {'Cache-Control': 'no-store'})
      .then(res => {
        console.log('The file saved to ', res.path())
        console.log('The file saved to ', RNFetchblob.wrap(res.path()))
      })
    // file:///data/user/0/com.integreat/files/test.jpg
    session.list()
  }

  render () {
    if (this.state.waitingForStore) {
      return null
    }

    return (
      <Provider store={this.store}>
        <I18nProvider>
          <CustomThemeProvider>
            <PlatformContext.Provider value={this.platform}>
              <AndroidStatusBarContainer />
              <IOSSafeAreaView>
                <WebContainer>
                  <WebView
                    onError={alert}
                    style={{
                      backgroundColor: 'yellow',
                      height: 100
                    }}
                    source={{
                      baseUrl: RNFetchblob.fs.dirs.DocumentDir,
                      // html: '<html><body><a href="file:///data/user/0/com.integreat/files/red.png">asdf</a></body></html>'

                      // html: '<html><body><img src="file:///sdcard/test.png">asdf</body></html>'
                      html: '<html><body><img src="file:///data/user/0/com.integreat/files/red.png">asdf</body></html>'
                    }}
                    allowFileAccess
                    originWhitelist={['*']}
                  />
                </WebContainer>
              </IOSSafeAreaView>
            </PlatformContext.Provider>
          </CustomThemeProvider>
        </I18nProvider>
      </Provider>
    )
  }
}

export default App
