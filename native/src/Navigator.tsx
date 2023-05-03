import { useNavigation } from '@react-navigation/native'
import { createStackNavigator, StackHeaderProps, TransitionPresets } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Platform, Text } from 'react-native'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  EXTERNAL_OFFER_ROUTE,
  FEEDBACK_MODAL_ROUTE,
  IMAGE_VIEW_MODAL_ROUTE,
  INTRO_ROUTE,
  IntroRouteType,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LandingRouteType,
  LICENSES_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  PDF_VIEW_MODAL_ROUTE,
  POIS_ROUTE,
  REDIRECT_ROUTE,
  RedirectRouteType,
  SEARCH_ROUTE,
  SETTINGS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
} from 'api-client'

import Header from './components/Header'
import RedirectContainer from './components/RedirectContainer'
import TransparentHeader from './components/TransparentHeader'
import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from './constants/NavigationTypes'
import buildConfig from './constants/buildConfig'
import { ASYNC_STORAGE_VERSION } from './constants/settings'
import { AppContext } from './contexts/AppContextProvider'
import useLoadCities from './hooks/useLoadCities'
import useSnackbar from './hooks/useSnackbar'
import CategoriesContainer from './routes/CategoriesContainer'
import ChangeLanguageModal from './routes/ChangeLanguageModal'
import CityNotCooperating from './routes/CityNotCooperating'
import DisclaimerContainer from './routes/DisclaimerContainer'
import EventsContainer from './routes/EventsContainer'
import ExternalOfferContainer from './routes/ExternalOfferContainer'
import FeedbackModalContainer from './routes/FeedbackModalContainer'
import ImageViewModal from './routes/ImageViewModal'
import Intro from './routes/Intro'
import JpalTracking from './routes/JpalTracking'
import Landing from './routes/Landing'
import Licenses from './routes/Licenses'
import NewsContainer from './routes/NewsContainer'
import OffersContainer from './routes/OffersContainer'
import PDFViewModal from './routes/PDFViewModal'
import PoisContainer from './routes/PoisContainer'
import SearchModalContainer from './routes/SearchModalContainer'
import Settings from './routes/Settings'
import SprungbrettOfferContainer from './routes/SprungbrettOfferContainer'
import appSettings from './utils/AppSettings'
import {
  quitAppStatePushNotificationListener,
  useForegroundPushNotificationListener,
} from './utils/PushNotificationsManager'
import { initSentry, log } from './utils/sentry'

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
}

const transparentHeader = (headerProps: StackHeaderProps) => <TransparentHeader {...(headerProps as HeaderProps)} />

const defaultHeader = (headerProps: StackHeaderProps) => <Header {...(headerProps as HeaderProps)} isHome={null} />
const settingsHeader = (headerProps: StackHeaderProps) => <Header {...(headerProps as HeaderProps)} isHome={false} />

type InitialRouteType =
  | {
      name: IntroRouteType | LandingRouteType | CategoriesRouteType
    }
  | {
      name: RedirectRouteType
      url: string
    }
const Stack = createStackNavigator<RoutesParamsType>()

const Navigator = (): ReactElement | null => {
  const { cityCode } = useContext(AppContext)
  const [waitingForSettings, setWaitingForSettings] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null)
  const [initialRoute, setInitialRoute] = useState<InitialRouteType>({
    name: INTRO_ROUTE,
  })

  // Preload cities
  useLoadCities()

  const showSnackbar = useSnackbar()
  const navigation = useNavigation<NavigationProps<RoutesType>>()

  useForegroundPushNotificationListener({ showSnackbar, navigate: navigation.navigate })

  useEffect(() => {
    // If the app is opened by clicking on a push notification, the navigation object is initially not ready
    // Therefore use the RedirectContainer to handle the deep link to the local news
    quitAppStatePushNotificationListener((url: string) =>
      setInitialRoute({
        name: REDIRECT_ROUTE,
        url,
      })
    )
  }, [])

  const updateInitialRoute = useCallback(
    (initialRoute: InitialRouteType) =>
      // Do not override initial route set by opening push notification
      setInitialRoute(previous => (previous.name === REDIRECT_ROUTE ? previous : initialRoute)),
    []
  )

  useEffect(() => {
    const initialize = async () => {
      const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null

      if (usingHermes) {
        log('App is using Hermes: https://reactnative.dev/docs/hermes')
      }

      const { introShown, storageVersion, errorTracking } = await appSettings.loadSettings()

      if (errorTracking) {
        initSentry()
      }

      if (!storageVersion) {
        await appSettings.setVersion(ASYNC_STORAGE_VERSION)
      }

      if (storageVersion !== ASYNC_STORAGE_VERSION) {
        // start a migration routine
      }

      if (!buildConfig().featureFlags.introSlides && !introShown) {
        await appSettings.setIntroShown()
      }

      if (buildConfig().featureFlags.introSlides && !introShown) {
        updateInitialRoute({
          name: INTRO_ROUTE,
        })
      } else if (cityCode) {
        updateInitialRoute({
          name: CATEGORIES_ROUTE,
        })
      } else {
        updateInitialRoute({
          name: LANDING_ROUTE,
        })
      }

      setWaitingForSettings(false)
    }

    initialize().catch(error => setErrorMessage(error.message))
  }, [cityCode, updateInitialRoute, setErrorMessage])

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  }
  if (waitingForSettings) {
    return null
  }

  // Keeps our previous transition we used in v4 of react-navigation on android. Fixes weird showing of splash screen on every navigate.
  const transitionPreset = Platform.select({
    android: TransitionPresets.FadeFromBottomAndroid,
    ios: TransitionPresets.DefaultTransition,
  })

  const redirectUrl = initialRoute.name === REDIRECT_ROUTE ? initialRoute.url : undefined

  return (
    <Stack.Navigator initialRouteName={initialRoute.name} screenOptions={{ ...transitionPreset, headerMode: 'screen' }}>
      <Stack.Group screenOptions={{ header: () => null }}>
        <Stack.Screen name={REDIRECT_ROUTE} initialParams={{ url: redirectUrl }} component={RedirectContainer} />
        <Stack.Screen name={INTRO_ROUTE} component={Intro} initialParams={{}} />
        <Stack.Screen name={SEARCH_ROUTE} component={SearchModalContainer} />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: defaultHeader }}>
        <Stack.Screen name={CATEGORIES_ROUTE} initialParams={{}} component={CategoriesContainer} />
        <Stack.Screen name={OFFERS_ROUTE} component={OffersContainer} />
        <Stack.Screen name={SPRUNGBRETT_OFFER_ROUTE} component={SprungbrettOfferContainer} />
        <Stack.Screen name={POIS_ROUTE} component={PoisContainer} />
        <Stack.Screen name={EVENTS_ROUTE} component={EventsContainer} />
        <Stack.Screen name={NEWS_ROUTE} component={NewsContainer} />
        <Stack.Screen name={DISCLAIMER_ROUTE} component={DisclaimerContainer} />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: transparentHeader }}>
        <Stack.Screen name={LANDING_ROUTE} component={Landing} />
        <Stack.Screen name={PDF_VIEW_MODAL_ROUTE} component={PDFViewModal} />
        <Stack.Screen name={CHANGE_LANGUAGE_MODAL_ROUTE} component={ChangeLanguageModal} />
        <Stack.Screen name={IMAGE_VIEW_MODAL_ROUTE} component={ImageViewModal} />
        <Stack.Screen name={FEEDBACK_MODAL_ROUTE} component={FeedbackModalContainer} />
        <Stack.Screen name={JPAL_TRACKING_ROUTE} component={JpalTracking} />
        {buildConfig().featureFlags.cityNotCooperating && (
          <Stack.Screen name={CITY_NOT_COOPERATING_ROUTE} component={CityNotCooperating} />
        )}
      </Stack.Group>

      <Stack.Group screenOptions={{ header: settingsHeader }}>
        <Stack.Screen name={SETTINGS_ROUTE} component={Settings} />
        <Stack.Screen name={LICENSES_ROUTE} component={Licenses} />
        <Stack.Screen name={EXTERNAL_OFFER_ROUTE} component={ExternalOfferContainer} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Navigator
