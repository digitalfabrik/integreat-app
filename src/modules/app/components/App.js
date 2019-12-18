// @flow

import * as React from 'react'

import { Provider } from 'react-redux'
import I18nProviderContainer from '../../i18n/containers/I18nProviderContainer'
import createReduxStore from '../createReduxStore'
import IOSSafeAreaView from '../../../modules/platform/components/IOSSafeAreaView'
import AndroidStatusBarContainer from '../../platform/containers/AndroidStatusBarContainer'
import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'
import DefaultDataContainer from '../../endpoint/DefaultDataContainer'
import type { DataContainer } from '../../endpoint/DataContainer'
import NavigatorContainer from '../containers/NavigatorContainer'

class App extends React.Component<{||}> {
  dataContainer: DataContainer = new DefaultDataContainer()
  store: Store<StateType, StoreActionType> = createReduxStore(this.dataContainer)

  render () {
    return (
      <Provider store={this.store}>
        <I18nProviderContainer>
          <>
            <AndroidStatusBarContainer />
            <IOSSafeAreaView>
              <NavigatorContainer />
            </IOSSafeAreaView>
          </>
        </I18nProviderContainer>
      </Provider>
    )
  }
}

export default App
