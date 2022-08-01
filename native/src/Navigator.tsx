import { useNavigation } from '@react-navigation/native'
import { createStackNavigator, StackHeaderProps, TransitionPresets } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Platform, Text } from 'react-native'
import { useDispatch } from 'react-redux'

import {
  CATEGORIES_ROUTE,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  DASHBOARD_ROUTE,
  DashboardRouteType,
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
  NEWS_ROUTE,
  OFFERS_ROUTE,
  PDF_VIEW_MODAL_ROUTE,
  POIS_ROUTE,
  REDIRECT_ROUTE,
  SEARCH_ROUTE,
  SETTINGS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
  LICENSE_ROUTE,
} from 'api-client'

import HeaderContainer from './components/HeaderContainer'
import RedirectContainer from './components/RedirectContainer'
import SettingsHeader from './components/SettingsHeader'
import TransparentHeader from './components/TransparentHeader'
import { NavigationPropType, RoutePropType, RoutesParamsType, RoutesType } from './constants/NavigationTypes'
import buildConfig from './constants/buildConfig'
import { ASYNC_STORAGE_VERSION } from './constants/settings'
import CategoriesContainer from './routes/CategoriesContainer'
import ChangeLanguageModal from './routes/ChangeLanguageModal'
import CityNotCooperating from './routes/CityNotCooperating'
import DashboardContainer from './routes/DashboardContainer'
import DisclaimerContainer from './routes/DisclaimerContainer'
import EventsContainer from './routes/EventsContainer'
import ExternalOfferContainer from './routes/ExternalOfferContainer'
import FeedbackModalContainer from './routes/FeedbackModalContainer'
import ImageViewModal from './routes/ImageViewModal'
import Intro from './routes/Intro'
import JpalTracking from './routes/JpalTracking'
import LandingContainer from './routes/LandingContainer'
import Licenses from './routes/Licenses'
import NewsContainer from './routes/NewsContainer'
import OffersContainer from './routes/OffersContainer'
import PDFViewModal from './routes/PDFViewModal'
import PoisContainer from './routes/PoisContainer'
import SearchModalContainer from './routes/SearchModalContainer'
import Settings from './routes/Settings'
import SprungbrettOfferContainer from './routes/SprungbrettOfferContainer'
import appSettings from './utils/AppSettings'
import { quitAppStatePushNotificationListener } from './utils/PushNotificationsManager'
import { initSentry, log } from './utils/sentry'

type HeaderProps = {
  route: RoutePropType<RoutesType>
  navigation: NavigationPropType<RoutesType>
}

const transparentHeader = (headerProps: StackHeaderProps) => <TransparentHeader {...(headerProps as HeaderProps)} />

const settingsHeader = (headerProps: StackHeaderProps) => <SettingsHeader {...headerProps} />

const defaultHeader = (headerProps: StackHeaderProps) => <HeaderContainer {...(headerProps as HeaderProps)} />

type PropsType = {
  fetchCategory: (cityCode: string, language: string, key: string, forceUpdate: boolean) => void
  fetchCities: (forceRefresh: boolean) => void
  routeKey: string | null | undefined
  routeName: string | null | undefined
}
type InitialRouteType =
  | {
      name: IntroRouteType | LandingRouteType
    }
  | {
      name: DashboardRouteType
      cityCode: string
      languageCode: string
    }
const Stack = createStackNavigator<RoutesParamsType>()

const Navigator = (props: PropsType): ReactElement | null => {
  const [waitingForSettings, setWaitingForSettings] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null)
  const [initialRoute, setInitialRoute] = useState<InitialRouteType>({
    name: INTRO_ROUTE,
  })
  const previousRouteKey = useRef<string | null | undefined>(null)
  const { fetchCities, fetchCategory, routeKey, routeName } = props
  const navigation = useNavigation() as NavigationPropType<RoutesType>
  const dispatch = useDispatch()

  useEffect(() => {
    fetchCities(false)
  }, [fetchCities])

  useEffect(() => {
    quitAppStatePushNotificationListener(dispatch, navigation)
  }, [dispatch, navigation])

  useEffect(() => {
    const initialize = async () => {
      const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null

      if (usingHermes) {
        log('App is using Hermes: https://reactnative.dev/docs/hermes')
      }

      const { introShown, selectedCity, contentLanguage, storageVersion, errorTracking } =
        await appSettings.loadSettings()

      if (errorTracking) {
        initSentry()
      }

      if (!storageVersion) {
        await appSettings.setVersion(ASYNC_STORAGE_VERSION)
      }

      if (storageVersion !== ASYNC_STORAGE_VERSION) {
        // start a migration routine
      }

      if (!contentLanguage) {
        throw Error('The contentLanguage has not been set correctly by I18nProvider!')
      }

      if (!buildConfig().featureFlags.introSlides && !introShown) {
        await appSettings.setIntroShown()
      }

      if (buildConfig().featureFlags.introSlides && !introShown) {
        setInitialRoute({
          name: INTRO_ROUTE,
        })
      } else {
        const city = buildConfig().featureFlags.fixedCity || selectedCity

        if (city) {
          setInitialRoute({
            name: DASHBOARD_ROUTE,
            cityCode: city,
            languageCode: contentLanguage,
          })
        } else {
          setInitialRoute({
            name: LANDING_ROUTE,
          })
        }
      }

      setWaitingForSettings(false)
    }

    initialize().catch(error => setErrorMessage(error.message))
  }, [setInitialRoute, setErrorMessage])

  // The following is used to have correct mapping from categories route mapping in redux state to the actual routes
  useEffect(() => {
    // Fetch categories if the initial route is the dashboard route and there was no route before
    // i.e. initial route was set by this component (Navigator)
    if (
      !previousRouteKey.current &&
      routeKey &&
      initialRoute.name === DASHBOARD_ROUTE &&
      routeName === DASHBOARD_ROUTE
    ) {
      fetchCategory(initialRoute.cityCode, initialRoute.languageCode, routeKey, false)
    }

    previousRouteKey.current = routeKey
  }, [routeKey, fetchCategory, initialRoute, routeName])

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

  return (
    <Stack.Navigator initialRouteName={initialRoute.name} screenOptions={{ ...transitionPreset, headerMode: 'screen' }}>
      <Stack.Group screenOptions={{ header: () => null }}>
        <Stack.Screen name={REDIRECT_ROUTE} component={RedirectContainer} />
        <Stack.Screen name={INTRO_ROUTE} component={Intro} initialParams={{}} />
        <Stack.Screen name={SEARCH_ROUTE} component={SearchModalContainer} />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: defaultHeader }}>
        <Stack.Screen name={DASHBOARD_ROUTE} component={DashboardContainer} />
        <Stack.Screen name={CATEGORIES_ROUTE} component={CategoriesContainer} />
        <Stack.Screen name={OFFERS_ROUTE} component={OffersContainer} />
        <Stack.Screen name={SPRUNGBRETT_OFFER_ROUTE} component={SprungbrettOfferContainer} />
        <Stack.Screen name={EXTERNAL_OFFER_ROUTE} component={ExternalOfferContainer} />
        <Stack.Screen name={POIS_ROUTE} component={PoisContainer} />
        <Stack.Screen name={EVENTS_ROUTE} component={EventsContainer} />
        <Stack.Screen name={NEWS_ROUTE} component={NewsContainer} />
        <Stack.Screen name={DISCLAIMER_ROUTE} component={DisclaimerContainer} />
        <Stack.Screen name={LICENSE_ROUTE} component={Licenses} />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: transparentHeader }}>
        <Stack.Screen name={LANDING_ROUTE} component={LandingContainer} />
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
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Navigator
