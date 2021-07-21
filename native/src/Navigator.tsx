import React, { ReactElement, useEffect, useRef, useState } from 'react'
import AppSettings from './utils/AppSettings'
import { Platform, Text } from 'react-native'
import { initSentry } from './utils/helpers'
import { ASYNC_STORAGE_VERSION } from './constants/settings'
import buildConfig from './constants/buildConfig'
import { StackHeaderProps, createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import IntroContainer from './routes/IntroContainer'
import LandingContainer from './routes/LandingContainer'
import DashboardContainer from './routes/DashboardContainer'
import TransparentHeaderContainer from './components/TransparentHeaderContainer'
import SettingsHeaderContainer from './components/SettingsHeaderContainer'
import HeaderContainer from './components/HeaderContainer'
import OffersContainer from './routes/OffersContainer'
import SprungbrettOfferContainer from './routes/SprungbrettOfferContainer'
import ExternalOfferContainer from './routes/ExternalOfferContainer'
import PoisContainer from './routes/PoisContainer'
import EventsContainer from './routes/EventsContainer'
import NewsContainer from './routes/NewsContainer'
import PDFViewModal from './routes/PDFViewModal'
import ChangeLanguageModalContainer from './routes/ChangeLanguageModalContainer'
import SearchModalContainer from './routes/SearchModalContainer'
import ImageViewModal from './routes/ImageViewModal'
import FeedbackModalContainer from './routes/FeedbackModalContainer'
import SettingsContainer from './routes/SettingsContainer'
import DisclaimerContainer from './routes/DisclaimerContainer'
import CategoriesContainer from './routes/CategoriesContainer'
import {
  DashboardRouteType,
  IntroRouteType,
  LandingRouteType,
  CATEGORIES_ROUTE,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  EXTERNAL_OFFER_ROUTE,
  FEEDBACK_MODAL_ROUTE,
  IMAGE_VIEW_MODAL_ROUTE,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  PDF_VIEW_MODAL_ROUTE,
  POIS_ROUTE,
  REDIRECT_ROUTE,
  SEARCH_ROUTE,
  SETTINGS_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE
} from 'api-client/src/routes'
import { RoutesParamsType } from './constants/NavigationTypes'
import RedirectContainer from './components/RedirectContainer'
import JpalTracking from './routes/JpalTracking'

const transparentHeader = (headerProps: StackHeaderProps) => <TransparentHeaderContainer {...headerProps} />

const settingsHeader = (headerProps: StackHeaderProps) => <SettingsHeaderContainer {...headerProps} />

const defaultHeader = (headerProps: StackHeaderProps) => <HeaderContainer {...headerProps} />

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
    name: INTRO_ROUTE
  })
  const previousRouteKey = useRef<string | null | undefined>(null)
  const { fetchCities, fetchCategory, routeKey, routeName } = props
  useEffect(() => {
    fetchCities(false)

    const initialize = async () => {
      const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null

      if (usingHermes) {
        console.log('App is using Hermes: https://reactnative.dev/docs/hermes')
      }

      const appSettings = new AppSettings()
      const {
        introShown,
        selectedCity,
        contentLanguage,
        storageVersion,
        errorTracking
      } = await appSettings.loadSettings()

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
          name: INTRO_ROUTE
        })
      } else {
        const city = buildConfig().featureFlags.fixedCity || selectedCity

        if (city) {
          setInitialRoute({
            name: DASHBOARD_ROUTE,
            cityCode: city,
            languageCode: contentLanguage
          })
        } else {
          setInitialRoute({
            name: LANDING_ROUTE
          })
        }
      }

      setWaitingForSettings(false)
    }

    initialize().catch(error => setErrorMessage(error.message))
  }, [fetchCities, setInitialRoute, setErrorMessage])
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
  } else if (waitingForSettings) {
    return null
  }

  // Keeps our previous transition we used in v4 of react-navigation on android. Fixes weird showing of splash screen on every navigate.
  const transitionPreset = Platform.select({
    android: TransitionPresets.FadeFromBottomAndroid,
    ios: TransitionPresets.DefaultTransition
  })
  return (
    <Stack.Navigator initialRouteName={initialRoute.name} headerMode='screen' screenOptions={transitionPreset}>
      <Stack.Screen
        name={REDIRECT_ROUTE}
        component={RedirectContainer}
        options={{
          header: () => null
        }}
      />
      <Stack.Screen
        name={INTRO_ROUTE}
        component={IntroContainer}
        options={{
          header: () => null
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name={LANDING_ROUTE}
        component={LandingContainer}
        options={{
          header: () => null
        }}
      />
      <Stack.Screen
        name={DASHBOARD_ROUTE}
        component={DashboardContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={CATEGORIES_ROUTE}
        component={CategoriesContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={OFFERS_ROUTE}
        component={OffersContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={SPRUNGBRETT_OFFER_ROUTE}
        component={SprungbrettOfferContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={EXTERNAL_OFFER_ROUTE}
        component={ExternalOfferContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={POIS_ROUTE}
        component={PoisContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={EVENTS_ROUTE}
        component={EventsContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={NEWS_ROUTE}
        component={NewsContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={DISCLAIMER_ROUTE}
        component={DisclaimerContainer}
        options={{
          header: defaultHeader
        }}
      />
      <Stack.Screen
        name={SEARCH_ROUTE}
        component={SearchModalContainer}
        options={{
          header: () => null
        }}
      />
      <Stack.Screen
        name={PDF_VIEW_MODAL_ROUTE}
        component={PDFViewModal}
        options={{
          header: transparentHeader
        }}
      />
      <Stack.Screen
        name={CHANGE_LANGUAGE_MODAL_ROUTE}
        component={ChangeLanguageModalContainer}
        options={{
          header: transparentHeader
        }}
      />
      <Stack.Screen
        name={IMAGE_VIEW_MODAL_ROUTE}
        component={ImageViewModal}
        options={{
          header: transparentHeader
        }}
      />
      <Stack.Screen
        name={FEEDBACK_MODAL_ROUTE}
        component={FeedbackModalContainer}
        options={{
          header: transparentHeader
        }}
      />
      <Stack.Screen
        name={SETTINGS_ROUTE}
        component={SettingsContainer}
        options={{
          header: settingsHeader
        }}
      />
      <Stack.Screen
        name={JPAL_TRACKING_ROUTE}
        component={JpalTracking}
        options={{
          header: transparentHeader
        }}
      />
    </Stack.Navigator>
  )
}

export default Navigator
