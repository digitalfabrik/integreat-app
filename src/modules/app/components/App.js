// @flow

import * as React from 'react'

import { Provider } from 'react-redux'
import I18nProvider from 'modules/i18n/containers/I18nProvider'
import createReduxStore from '../createReduxStore'
import CustomThemeProvider from '../../theme/containers/CustomThemeProvider'
import IOSSafeAreaView from 'modules/platform/components/IOSSafeAreaView'
import AndroidStatusBarContainer from '../../platform/containers/AndroidStatusBarContainer'
import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'
import Navigator from './Navigator'
import MemoryDatabase from '../../endpoint/MemoryDatabase'

class App extends React.Component<{}, { waitingForStore: boolean }> {
  store: Store<StateType, StoreActionType>
  database: MemoryDatabase

  constructor () {
    super()
    this.state = {waitingForStore: true}
    this.database = new MemoryDatabase()
    const storeConfig = createReduxStore(this.database, () => { this.setState({waitingForStore: false}) })
    this.store = storeConfig.store
  }

  render () {
    if (this.state.waitingForStore) {
      return null
    }

    return (
        <Provider store={this.store}>
          <I18nProvider>
            <CustomThemeProvider>
              <>
                <AndroidStatusBarContainer />
                <IOSSafeAreaView>
                  <Navigator />
                </IOSSafeAreaView>
              </>
            </CustomThemeProvider>
          </I18nProvider>
        </Provider>
    )
  }
}

export default App
