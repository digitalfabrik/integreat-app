import React, { useState, useCallback, ReactElement } from 'react'
import { Provider } from 'react-redux'
import createReduxStore from './redux/createReduxStore'
import IOSSafeAreaView from './components/IOSSafeAreaView'
import StatusBarContainer from './components/StatusBarContainer'
import { Store } from 'redux'
import { StateType } from './redux/StateType'
import { StoreActionType } from './redux/StoreActionType'
import DefaultDataContainer from './utils/DefaultDataContainer'
import { DataContainer } from './utils/DataContainer'
import NavigatorContainer from './NavigatorContainer'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import StaticServerProvider from './components/StaticServerProvider'
import I18nProvider from './components/I18nProvider'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { CLOSE_PAGE_SIGNAL_NAME, REDIRECT_ROUTE } from 'api-client'
import AppStateListener from './components/AppStateListener'
import { ThemeProvider } from 'styled-components'
import buildConfig from './constants/buildConfig'
import SnackbarContainer from './components/SnackbarContainer'
import NetInfo from '@react-native-community/netinfo'
import sendTrackingSignal from './utils/sendTrackingSignal'
import useSendOfflineJpalSignals from './hooks/useSendOfflineJpalSignals'
import { enableScreens } from 'react-native-screens'

enableScreens(true)

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

const App = (): ReactElement => {
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
