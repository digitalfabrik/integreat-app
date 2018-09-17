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
import { WebView } from 'react-native'

class App extends React.Component<{}, { waitingForStore: boolean }> {
  platform: Platform

  store: Store<StateType, StoreActionType>

  constructor () {
    super()
    this.state = {waitingForStore: true}
    const storeConfig = createReduxStore(() => { this.setState({waitingForStore: false}) }, false)
    this.store = storeConfig.store
    this.platform = new Platform()

    //   const session = RNFetchblob.session()
    //   RNFetchblob.config({
    //     path: `${RNFetchblob.fs.dirs.DocumentDir}/test.jpg`
    //   })
    //     .fetch('GET', 'https://cms.integreat-app.de/augsburg/wp-content/uploads/sites/2/2015/09/BMFSFJ_DemokratieLeben.jpg')
    //     .then(res => {
    //       console.log('The file saved to ', res.path())
    //       console.log('The file saved to ', RNFetchblob.wrap(res.path()))
    //     })
    //   // file:///data/user/0/com.integreat/files/test.jpg
    //   session.list()
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
                <WebView
                  onError={alert}
                  source={{
                    baseUrl: RNFetchblob.fs.dirs.DocumentDir,
                    html: '<html><body><img src="' + RNFetchblob.fs.dirs.DocumentDir + '/test.jpg">asdf</body></html>'
                  }}
                  mixedContentMode={'always'}
                  javaScriptEnabled
                  allowUniversalAccessFromFileURLs
                  geolocationEnabled
                  domStorageEnabled
                  originWhitelist={['*']}
                />
              </IOSSafeAreaView>
            </PlatformContext.Provider>
          </CustomThemeProvider>
        </I18nProvider>
      </Provider>
    )
  }
}

export default App
