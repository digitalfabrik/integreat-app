import NetInfo from '@react-native-community/netinfo'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { OverflowMenuProvider } from 'react-navigation-header-buttons'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { ThemeProvider } from 'styled-components'

import { CLOSE_PAGE_SIGNAL_NAME, REDIRECT_ROUTE, setUserAgent } from 'api-client'

import NavigatorContainer from './NavigatorContainer'
import AppStateListener from './components/AppStateListener'
import I18nProvider from './components/I18nProvider'
import IOSSafeAreaView from './components/IOSSafeAreaView'
import SnackbarContainer from './components/SnackbarContainer'
import StaticServerProvider from './components/StaticServerProvider'
import StatusBar from './components/StatusBar'
import { RoutesParamsType } from './constants/NavigationTypes'
import buildConfig from './constants/buildConfig'
import { userAgent } from './constants/endpoint'
import useSendOfflineJpalSignals from './hooks/useSendOfflineJpalSignals'
import { StateType } from './redux/StateType'
import { StoreActionType } from './redux/StoreActionType'
import createReduxStore from './redux/createReduxStore'
import { DataContainer } from './utils/DataContainer'
import DefaultDataContainer from './utils/DefaultDataContainer'
import { backgroundAppStatePushNotificationListener } from './utils/PushNotificationsManager'
import sendTrackingSignal from './utils/sendTrackingSignal'

enableScreens(true)

LogBox.ignoreLogs(['NativeEventEmitter'])

NetInfo.configure({
  reachabilityUrl: 'https://cms.integreat-app.de/ping',
})
const linking: LinkingOptions<RoutesParamsType> = {
  prefixes: ['https://', 'integreat://'],
  config: {
    screens: {
      [REDIRECT_ROUTE]: '*',
    },
  },
  getStateFromPath: (path: string) => ({
    index: 0,
    routes: [
      {
        name: REDIRECT_ROUTE,
        params: {
          url: `https://${path}`,
        },
      },
    ],
  }),
  subscribe: backgroundAppStatePushNotificationListener,
}
const dataContainer: DataContainer = new DefaultDataContainer()
const store: Store<StateType, StoreActionType> = createReduxStore(dataContainer)
setUserAgent(userAgent)

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
              name: CLOSE_PAGE_SIGNAL_NAME,
            },
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
                <StatusBar />
                <IOSSafeAreaView>
                  <NavigationContainer onStateChange={onStateChange} linking={linking}>
                    <OverflowMenuProvider>
                      <NavigatorContainer routeKey={routeKey} routeName={routeName} />
                    </OverflowMenuProvider>
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
