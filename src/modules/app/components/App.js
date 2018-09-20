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
import Navigator from './Navigator'

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
    // /var/mobile/Containers/Data/Application/B11F8743-5778-4B4D-B455-F5B3B1AEB17D/Documents/red.png
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
                <Navigator />
              </IOSSafeAreaView>
            </PlatformContext.Provider>
          </CustomThemeProvider>
        </I18nProvider>
      </Provider>
    )
  }
}

export default App
