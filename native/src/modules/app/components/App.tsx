import React, { useState, useCallback } from 'react'
import { Provider } from 'react-redux'
import createReduxStore from '../createReduxStore'
import IOSSafeAreaView from '../../../modules/platform/components/IOSSafeAreaView'
import StatusBarContainer from '../containers/StatusBarContainer'
import { Store } from 'redux'
import { StateType } from '../StateType'
import { StoreActionType } from '../StoreActionType'
import DefaultDataContainer from '../../endpoint/DefaultDataContainer'
import { DataContainer } from '../../endpoint/DataContainer'
import NavigatorContainer from '../containers/NavigatorContainer'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import StaticServerProvider from '../../static-server/containers/StaticServerProvider'
import I18nProvider from '../../i18n/components/I18nProvider'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { CLOSE_PAGE_SIGNAL_NAME, REDIRECT_ROUTE } from 'api-client'
import AppStateListener from './AppStateListener'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../constants/buildConfig'
import SnackbarContainer from '../../layout/containers/SnackbarContainer'
import NetInfo from '@react-native-community/netinfo'
import sendTrackingSignal from '../../endpoint/sendTrackingSignal'
import useSendOfflineJpalSignals from '../hooks/useSendOfflineJpalSignals'
NetInfo.configure({
  reachabilityUrl: 'https://cms.integreat-app.de/ping'
})
const linking: LinkingOptions = {
  prefixes: ['https://', 'integreat://'],
  config: {
    screens: {
      [REDIRECT_ROUTE]: '*'
    }
  },
  getStateFromPath: path => {
    return {
      index: 0,
      routes: [
        {
          name: REDIRECT_ROUTE,
          params: {
            url: `https://${path}`
          }
        }
      ]
    }
  }
}
const dataContainer: DataContainer = new DefaultDataContainer()
const store: Store<StateType, StoreActionType> = createReduxStore(dataContainer)

const App = () => {
  const [routeName, setRouteName] = useState<string | null | undefined>(null)
  const [routeKey, setRouteKey] = useState<string | null | undefined>(null)
  const [routeIndex, setRouteIndex] = useState<number>(0)
  useSendOfflineJpalSignals()
  const onStateChange = useCallback(
    state => {
      if (state) {
        if (state.index === routeIndex - 1) {
          sendTrackingSignal({
            signal: {
              name: CLOSE_PAGE_SIGNAL_NAME
            }
          })
        }

        const route = state.routes[state.index]
        setRouteName(route.name)
        setRouteKey(route.key)
        setRouteIndex(state.index)
      }
    },
    [routeIndex]
  )
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
                    <NavigatorContainer routeKey={routeKey} routeName={routeName} />
                  </NavigationContainer>
                </IOSSafeAreaView>
                <SnackbarContainer />
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
