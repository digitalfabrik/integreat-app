import NetInfo from '@react-native-community/netinfo'
import messaging from '@react-native-firebase/messaging'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { Linking } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { OverflowMenuProvider } from 'react-navigation-header-buttons'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { ThemeProvider } from 'styled-components'

import { CLOSE_PAGE_SIGNAL_NAME, LOCAL_NEWS_TYPE, NEWS_ROUTE, REDIRECT_ROUTE, setUserAgent } from 'api-client'

import NavigatorContainer from './NavigatorContainer'
import AppStateListener from './components/AppStateListener'
import I18nProvider from './components/I18nProvider'
import IOSSafeAreaView from './components/IOSSafeAreaView'
import SnackbarContainer from './components/SnackbarContainer'
import StaticServerProvider from './components/StaticServerProvider'
import StatusBarContainer from './components/StatusBarContainer'
import buildConfig from './constants/buildConfig'
import { userAgent } from './constants/endpoint'
import useSendOfflineJpalSignals from './hooks/useSendOfflineJpalSignals'
import urlFromRouteInformation from './navigation/url'
import { StateType } from './redux/StateType'
import { StoreActionType } from './redux/StoreActionType'
import createReduxStore from './redux/createReduxStore'
import AppSettings from './utils/AppSettings'
import { DataContainer } from './utils/DataContainer'
import DefaultDataContainer from './utils/DefaultDataContainer'
import sendTrackingSignal from './utils/sendTrackingSignal'

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
  getStateFromPath: path => ({
    index: 0,
    routes: [
      {
        name: REDIRECT_ROUTE,
        params: {
          url: `https://${path}`
        }
      }
    ]
  }),
  subscribe: buildConfig().featureFlags.pushNotifications
    ? (listener: (url: string) => void) => {
        const onReceiveURL = ({ url }: { url: string }) => listener(url)

        Linking.addEventListener('url', onReceiveURL)

        // TODO IGAPP-263: Temporary workaround until cityCode, languageCode and newsId are part of the push notifications
        const unsubscribeNotification = messaging().onNotificationOpenedApp(() => {
          const appSettings = new AppSettings()
          appSettings.loadSettings().then(settings => {
            const { selectedCity, contentLanguage } = settings
            if (selectedCity && contentLanguage) {
              listener(
                urlFromRouteInformation({
                  cityCode: selectedCity,
                  languageCode: contentLanguage,
                  route: NEWS_ROUTE,
                  newsType: LOCAL_NEWS_TYPE
                })
              )
            }
          })
        })

        return () => {
          Linking.removeEventListener('url', onReceiveURL)
          unsubscribeNotification()
        }
      }
    : undefined
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
