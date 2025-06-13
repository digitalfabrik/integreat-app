import NetInfo from '@react-native-community/netinfo'
import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
  NavigationState,
  ParamListBase,
  Theme as NavigationContainerTheme,
} from '@react-navigation/native'
import { Settings as LuxonSettings } from 'luxon'
import React, { ReactElement, useCallback, useState } from 'react'
import { LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { HeaderButtonsProvider } from 'react-navigation-header-buttons'
import { useTheme } from 'styled-components'

import { CLOSE_PAGE_SIGNAL_NAME, REDIRECT_ROUTE } from 'shared'
import { setUserAgent } from 'shared/api'
import { config } from 'translations'

import Navigator from './Navigator'
import AppStateListener from './components/AppStateListener'
import I18nProvider from './components/I18nProvider'
import IOSSafeAreaView from './components/IOSSafeAreaView'
import SnackbarContainer from './components/SnackbarContainer'
import StaticServerProvider from './components/StaticServerProvider'
import StatusBar from './components/StatusBar'
import { ThemeContainer } from './components/ThemeContext'
import TtsContainer from './components/TtsContainer'
import { RoutesParamsType } from './constants/NavigationTypes'
import { userAgent } from './constants/endpoint'
import AppContextProvider from './contexts/AppContextProvider'
import useSendOfflineJpalSignals from './hooks/useSendOfflineJpalSignals'
import { backgroundAppStatePushNotificationListener } from './utils/PushNotificationsManager'
import sendTrackingSignal from './utils/sendTrackingSignal'

enableScreens(true)
LuxonSettings.throwOnInvalid = true
LuxonSettings.defaultLocale = config.defaultFallback
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
setUserAgent(userAgent)

type NavigationContainerWithThemeProps = {
  onStateChange: (state: NavigationState | undefined) => void
  linking: LinkingOptions<ParamListBase>
}

export const NavigationContainerWithTheme = ({
  onStateChange,
  linking,
}: NavigationContainerWithThemeProps): ReactElement => {
  const theme = useTheme()

  const navigationTheme: NavigationContainerTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      card: theme.colors.backgroundColor,
    },
  }

  return (
    <>
      <StatusBar />
      <IOSSafeAreaView>
        <NavigationContainer onStateChange={onStateChange} linking={linking} theme={navigationTheme}>
          <HeaderButtonsProvider stackType='native'>
            <Navigator />
          </HeaderButtonsProvider>
        </NavigationContainer>
      </IOSSafeAreaView>
    </>
  )
}

const App = (): ReactElement => {
  const [routeIndex, setRouteIndex] = useState<number>(0)

  useSendOfflineJpalSignals()

  const onStateChange = useCallback(
    (state: NavigationState | undefined) => {
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
    [routeIndex],
  )

  return (
    <>
      <StaticServerProvider>
        <I18nProvider>
          <AppContextProvider>
            <ThemeContainer>
              <SafeAreaProvider>
                <SnackbarContainer>
                  <TtsContainer>
                    <NavigationContainerWithTheme onStateChange={onStateChange} linking={linking} />
                  </TtsContainer>
                </SnackbarContainer>
              </SafeAreaProvider>
            </ThemeContainer>
          </AppContextProvider>
        </I18nProvider>
      </StaticServerProvider>
      <AppStateListener />
    </>
  )
}

export default App
