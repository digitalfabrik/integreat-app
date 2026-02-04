import { useNavigation } from '@react-navigation/native'
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'

import {
  BOTTOM_TAB_NAVIGATION_ROUTE,
  BottomTabNavigationRouteType,
  CategoriesRouteType,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  CONSENT_ROUTE,
  DISCLAIMER_ROUTE,
  FEEDBACK_MODAL_ROUTE,
  IMAGE_VIEW_MODAL_ROUTE,
  INTRO_ROUTE,
  IntroRouteType,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LandingRouteType,
  LICENSES_ROUTE,
  PDF_VIEW_MODAL_ROUTE,
  REDIRECT_ROUTE,
  RedirectRouteType,
  SEARCH_ROUTE,
  SETTINGS_ROUTE,
} from 'shared'

import Header from './components/Header'
import RedirectContainer from './components/RedirectContainer'
import TransparentHeader from './components/TransparentHeader'
import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from './constants/NavigationTypes'
import buildConfig from './constants/buildConfig'
import { useAppContext } from './hooks/useCityAppContext'
import useLoadCities from './hooks/useLoadCities'
import useSnackbar from './hooks/useSnackbar'
import BottomTabNavigation from './navigation/BottomTabNavigation'
import ChangeLanguageModal from './routes/ChangeLanguageModal'
import CityNotCooperating from './routes/CityNotCooperating'
import Consent from './routes/Consent'
import DisclaimerContainer from './routes/DisclaimerContainer'
import FeedbackModalContainer from './routes/FeedbackModalContainer'
import ImageViewModal from './routes/ImageViewModal'
import Intro from './routes/Intro'
import JpalTracking from './routes/JpalTracking'
import Landing from './routes/Landing'
import Licenses from './routes/Licenses'
import LoadingErrorHandler from './routes/LoadingErrorHandler'
import PDFViewModal from './routes/PDFViewModal'
import SearchModalContainer from './routes/SearchModalContainer'
import Settings from './routes/Settings'
import { ASYNC_STORAGE_VERSION } from './utils/AppSettings'
import dataContainer from './utils/DefaultDataContainer'
import { usePushNotificationListener } from './utils/PushNotificationsManager'
import getTransitionPreset from './utils/getTransitionPreset'
import { initSentry, log, reportError } from './utils/sentry'

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
}

const transparentHeader = (headerProps: StackHeaderProps) => <TransparentHeader {...(headerProps as HeaderProps)} />

export const defaultHeader = (headerProps: StackHeaderProps): ReactElement => (
  <Header {...(headerProps as HeaderProps)} />
)
const settingsHeader = (headerProps: StackHeaderProps) => (
  <Header {...(headerProps as HeaderProps)} showOverflowItems={false} />
)

const Stack = createStackNavigator<RoutesParamsType>()

type InitialRouteType =
  | {
      name: IntroRouteType | LandingRouteType | CategoriesRouteType | BottomTabNavigationRouteType
    }
  | {
      name: RedirectRouteType
      url: string
    }
  | null

const Navigator = (): ReactElement | null => {
  const showSnackbar = useSnackbar()
  const appContext = useAppContext()
  const { settings, cityCode, changeCityCode, updateSettings } = appContext
  const navigation = useNavigation<NavigationProps<RoutesType>>()
  const [initialRoute, setInitialRoute] = useState<InitialRouteType>(null)

  // Preload cities
  const { data: cities, error: citiesError, refresh: refreshCities } = useLoadCities()

  usePushNotificationListener(navigation.navigate)

  const updateInitialRoute = useCallback(
    (initialRoute: InitialRouteType) =>
      // Do not override initial route set by opening push notification
      setInitialRoute(previous => (previous?.name === REDIRECT_ROUTE ? previous : initialRoute)),
    [],
  )

  useEffect(() => {
    const { errorTracking, storageVersion, introShown } = settings
    const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null

    if (usingHermes) {
      log('App is using Hermes: https://reactnative.dev/docs/hermes')
    }

    if (errorTracking) {
      initSentry()
    }

    if (!storageVersion) {
      updateSettings({ storageVersion: ASYNC_STORAGE_VERSION })
    }

    if (!buildConfig().featureFlags.introSlides && !introShown) {
      updateSettings({ introShown: true })
    }
  }, [updateSettings, settings])

  useEffect(() => {
    if (initialRoute) {
      return
    }
    if (buildConfig().featureFlags.introSlides && !settings.introShown) {
      updateInitialRoute({ name: INTRO_ROUTE })
    } else if (!cityCode) {
      updateInitialRoute({ name: LANDING_ROUTE })
    } else if (cities?.find(it => it.code === cityCode)) {
      updateInitialRoute({ name: BOTTOM_TAB_NAVIGATION_ROUTE })
    } else if (cities) {
      // City is not available anymore
      changeCityCode(null)
      showSnackbar({ text: 'notFound.city' })
      dataContainer.deleteCity(cityCode).catch(reportError)
      updateInitialRoute({ name: LANDING_ROUTE })
    }
  }, [cities, changeCityCode, cityCode, showSnackbar, settings, initialRoute, updateInitialRoute])

  if (!initialRoute) {
    return citiesError ? <LoadingErrorHandler error={citiesError} loading={false} refresh={refreshCities} /> : null
  }

  const transitionPreset = getTransitionPreset()

  const redirectUrl = initialRoute.name === REDIRECT_ROUTE ? initialRoute.url : undefined

  return (
    <Stack.Navigator initialRouteName={initialRoute.name} screenOptions={{ ...transitionPreset, headerMode: 'screen' }}>
      <Stack.Group screenOptions={{ header: () => null }}>
        <Stack.Screen name={REDIRECT_ROUTE} initialParams={{ url: redirectUrl }} component={RedirectContainer} />
        <Stack.Screen name={INTRO_ROUTE} component={Intro} initialParams={{}} />
        <Stack.Screen name={SEARCH_ROUTE} component={SearchModalContainer} />
        <Stack.Screen name={BOTTOM_TAB_NAVIGATION_ROUTE} component={BottomTabNavigation} />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: defaultHeader }}>
        <Stack.Screen name={DISCLAIMER_ROUTE} component={DisclaimerContainer} />
        <Stack.Screen name={FEEDBACK_MODAL_ROUTE} component={FeedbackModalContainer} />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: transparentHeader }}>
        <Stack.Screen name={LANDING_ROUTE} component={Landing} />
        <Stack.Screen name={PDF_VIEW_MODAL_ROUTE} component={PDFViewModal} />
        <Stack.Screen name={CHANGE_LANGUAGE_MODAL_ROUTE} component={ChangeLanguageModal} />
        <Stack.Screen name={IMAGE_VIEW_MODAL_ROUTE} component={ImageViewModal} />
        <Stack.Screen name={JPAL_TRACKING_ROUTE} component={JpalTracking} />
        {buildConfig().featureFlags.cityNotCooperating && (
          <Stack.Screen name={CITY_NOT_COOPERATING_ROUTE} component={CityNotCooperating} />
        )}
      </Stack.Group>

      <Stack.Group screenOptions={{ header: settingsHeader }}>
        <Stack.Screen name={SETTINGS_ROUTE} component={Settings} />
        <Stack.Screen name={LICENSES_ROUTE} component={Licenses} />
        <Stack.Screen name={CONSENT_ROUTE} component={Consent} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Navigator
