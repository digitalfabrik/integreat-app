// @flow

import React, { useState, useCallback } from 'react'
import { Provider } from 'react-redux'
import I18nProviderContainer from '../../i18n/containers/I18nProviderContainer'
import createReduxStore from '../createReduxStore'
import IOSSafeAreaView from '../../../modules/platform/components/IOSSafeAreaView'
import StatusBarContainer from '../containers/StatusBarContainer'
import type { Store } from 'redux'
import type { StateType } from '../StateType'
import type { StoreActionType } from '../StoreActionType'
import DefaultDataContainer from '../../endpoint/DefaultDataContainer'
import type { DataContainer } from '../../endpoint/DataContainer'
import NavigatorContainer from '../containers/NavigatorContainer'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import StaticServerProvider from '../../static-server/containers/StaticServerProvider'
import { NavigationContainer } from '@react-navigation/native'
import PermissionSnackbarContainer from '../../layout/containers/PermissionSnackbarContainer'

const dataContainer: DataContainer = new DefaultDataContainer()
const store: Store<StateType, StoreActionType> = createReduxStore(dataContainer)

const App = () => {
  const [routeName, setRouteName] = useState<?string>(null)

  const onStateChange = useCallback(state => {
    if (state) {
      setRouteName(state.routes[state.index].name)
    }
  }, [])

  return (
    <Provider store={store}>
      <StaticServerProvider>
        <I18nProviderContainer>
          <SafeAreaProvider>
            <>
              <StatusBarContainer />
              <IOSSafeAreaView>
                <NavigationContainer onStateChange={onStateChange}>
                  <NavigatorContainer />
                </NavigationContainer>
              </IOSSafeAreaView>
              <PermissionSnackbarContainer routeName={routeName} />
            </>
          </SafeAreaProvider>
        </I18nProviderContainer>
      </StaticServerProvider>
    </Provider>
  )
}

export default App
