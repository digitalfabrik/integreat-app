// @flow

import React, { useState, useCallback } from 'react'
import { Provider } from 'react-redux'
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
import I18nProvider from '../../i18n/components/I18nProvider'
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native'
import PermissionSnackbarContainer from '../../layout/containers/PermissionSnackbarContainer'
import { REDIRECT_ROUTE } from 'api-client'
import AppStateListener from './AppStateListener'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../constants/buildConfig'
import NetInfo from '@react-native-community/netinfo'

NetInfo.configure({
  reachabilityUrl: 'https://cms.integreat-app.de/ping'
})

const linking: LinkingOptions = {
  prefixes: ['https://', 'integreat://'],
  // $FlowFixMe redirect is part of available routes
  config: {
    screens: {
      [REDIRECT_ROUTE]: '*'
    }
  },
  getStateFromPath: path => {
    return { index: 0, routes: [{ name: REDIRECT_ROUTE, params: { url: `https://${path}` } }] }
  }
}

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
      if (route.params?.cityCode) {
        setCityCode(typeof route.params.cityCode === 'string' ? route.params.cityCode : null)
      }
      if (route.params?.languageCode) {
        setLanguageCode(typeof route.params.languageCode === 'string' ? route.params.languageCode : null)
      }
    }
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={buildConfig().lightTheme}>
        <StaticServerProvider>
          <I18nProvider>
            <SafeAreaProvider>
              <>
                <StatusBarContainer />
                <IOSSafeAreaView>
                  <NavigationContainer onStateChange={onStateChange} linking={linking}>
                    <NavigatorContainer
                      routeKey={routeKey}
                      routeName={routeName}
                      languageCode={languageCode}
                      cityCode={cityCode}
                    />
                  </NavigationContainer>
                </IOSSafeAreaView>
                {routeName && <PermissionSnackbarContainer routeName={routeName} />}
              </>
            </SafeAreaProvider>
          </I18nProvider>
        </StaticServerProvider>
      </ThemeProvider>
      <AppStateListener />
    </Provider>
  )
}

export default App
