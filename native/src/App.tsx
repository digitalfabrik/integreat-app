import NetInfo from '@react-native-community/netinfo'
import { LinkingOptions, NavigationContainer, NavigationState } from '@react-navigation/native'
import { Settings as LuxonSettings } from 'luxon'
import React, { ReactElement, useCallback, useState } from 'react'
import { LogBox, View } from 'react-native'
import { registerTranslation, en, de, ar, es, fr, hi, it, nl, pl, pt, tr, zh } from 'react-native-paper-dates'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'
import { useTheme } from 'styled-components/native'

import { CLOSE_PAGE_SIGNAL_NAME, REDIRECT_ROUTE } from 'shared'
import { setUserAgent } from 'shared/api'
import { config } from 'translations'

import Navigator from './Navigator'
import AppStateListener from './components/AppStateListener'
import I18nProvider from './components/I18nProvider'
import SnackbarContainer from './components/SnackbarContainer'
import StaticServerProvider from './components/StaticServerProvider'
import StatusBar from './components/StatusBar'
import ThemeContainer from './components/ThemeContainer'
import TtsContainer from './components/TtsContainer'
import { RoutesParamsType } from './constants/NavigationTypes'
import { userAgent } from './constants/endpoint'
import AppContextProvider from './contexts/AppContextProvider'
import { useNavigationTheme } from './hooks/useNavigationTheme'
import useSendOfflineJpalSignals from './hooks/useSendOfflineJpalSignals'
import sendTrackingSignal from './utils/sendTrackingSignal'

enableScreens(true)
LuxonSettings.throwOnInvalid = true
LuxonSettings.defaultLocale = config.defaultFallback
LogBox.ignoreLogs(['NativeEventEmitter'])

registerTranslation('en', en)
registerTranslation('de', de)
registerTranslation('ar', ar)
registerTranslation('es', es)
registerTranslation('fr', fr)
registerTranslation('hi', hi)
registerTranslation('it', it)
registerTranslation('nl', nl)
registerTranslation('pl', pl)
registerTranslation('pt', pt)
registerTranslation('tr', tr)
registerTranslation('zh', zh)

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
}
setUserAgent(userAgent)

type NavigationContainerWithThemeProps = {
  onStateChange: (state: NavigationState | undefined) => void
}

export const NavigationContainerWithTheme = ({ onStateChange }: NavigationContainerWithThemeProps): ReactElement => {
  const theme = useTheme()
  const navigationTheme = useNavigationTheme()

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceVariant }}>
      <StatusBar />
      <NavigationContainer onStateChange={onStateChange} theme={navigationTheme} linking={linking}>
        <Navigator />
      </NavigationContainer>
    </View>
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
                    <NavigationContainerWithTheme onStateChange={onStateChange} />
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
