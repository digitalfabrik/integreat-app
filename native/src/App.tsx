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

import Navigator from './Navigator'
import AppStateListener from './components/AppStateListener'
import I18nProvider from './components/I18nProvider'
import IOSSafeAreaView from './components/IOSSafeAreaView'
import SnackbarContainer from './components/SnackbarContainer'
import StaticServerProvider from './components/StaticServerProvider'
import StatusBar from './components/StatusBar'
import { RoutesParamsType } from './constants/NavigationTypes'
import buildConfig from './constants/buildConfig'
import { userAgent } from './constants/endpoint'
import AppContextProvider from './contexts/AppContextProvider'
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
              <AppContextProvider>
                <>
                  <StatusBar />
                  <IOSSafeAreaView>
                    <NavigationContainer onStateChange={onStateChange} linking={linking}>
                      <OverflowMenuProvider>
                        <Navigator />
                      </OverflowMenuProvider>
                    </NavigationContainer>
                  </IOSSafeAreaView>
                  <SnackbarContainer />
                </>
              </AppContextProvider>
            </SafeAreaProvider>
          </I18nProvider>
        </StaticServerProvider>
      </ThemeProvider>
      <AppStateListener />
    </Provider>
  )
}

export default App
