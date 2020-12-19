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
  const [routeKey, setRouteKey] = useState<?string>(null)
  const [cityCode, setCityCode] = useState<?string>(null)
  const [languageCode, setLanguageCode] = useState<?string>(null)

  const onStateChange = useCallback(state => {
    if (state) {
      const route = state.routes[state.index]
      setRouteName(route.name)
      setRouteKey(route.key)
      if (route.params?.cityCode && route.params?.languageCode) {
        // $FlowFixMe cityCode is not of type mixed
        setCityCode(route.params.cityCode)
        // $FlowFixMe languageCode is not of type mixed
        setLanguageCode(route.params.languageCode)
      }
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
                  <NavigatorContainer routeKey={routeKey}
                                      routeName={routeName}
                                      languageCode={languageCode}
                                      cityCode={cityCode} />
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
