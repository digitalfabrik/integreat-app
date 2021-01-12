// @flow

import React, { useState, useEffect, useRef } from 'react'
import AppSettings from '../../settings/AppSettings'
import { Text, Platform } from 'react-native'
import initSentry from '../initSentry'
import { ASYNC_STORAGE_VERSION } from '../../settings/constants'
import buildConfig from '../constants/buildConfig'
import { createStackNavigator, TransitionPresets, type StackHeaderProps } from '@react-navigation/stack'
import IntroContainer from '../../../routes/intro/IntroContainer'
import LandingContainer from '../../../routes/landing/containers/LandingContainer'
import TransparentHeaderContainer from '../../layout/containers/TransparentHeaderContainer'
import SettingsHeaderContainer from '../../layout/containers/SettingsHeaderContainer'
import HeaderContainer from '../../layout/containers/HeaderContainer'
import OffersContainer from '../../../routes/offers/containers/OffersContainer'
import WohnenOfferContainer from '../../../routes/wohnen/containers/WohnenOfferContainer'
import SprungbrettOfferContainer from '../../../routes/sprungbrett/containers/SprungbrettOfferContainer'
import ExternalOfferContainer from '../../../routes/external-offer/containers/ExternalOfferContainer'
import PoisContainer from '../../../routes/pois/containers/PoisContainer'
import EventsContainer from '../../../routes/events/containers/EventsContainer'
import NewsContainer from '../../../routes/news/containers/NewsContainer'
import PDFViewModal from '../../../routes/pdf/components/PDFViewModal'
import ChangeLanguageModalContainer from '../../../routes/language/containers/ChangeLanguageModalContainer'
import SearchModalContainer from '../../../routes/search/containers/SearchModalContainer'
import ImageViewModal from '../../../routes/image/components/ImageViewModal'
import FeedbackModalContainer from '../../../routes/feedback/containers/FeedbackModalContainer'
import SettingsContainer from '../../../routes/settings/container/SettingsContainer'
import DisclaimerContainer from '../../../routes/disclaimer/DisclaimerContainer'
import DashboardContainer from '../../../routes/dashboard/containers/DashboardContainer'
import CategoriesContainer from '../../../routes/categories/containers/CategoriesContainer'
import {
  CATEGORIES_ROUTE, CHANGE_LANGUAGE_MODAL_ROUTE, SPRUNGBRETT_OFFER_ROUTE, WOHNEN_OFFER_ROUTE,
  DASHBOARD_ROUTE, DISCLAIMER_ROUTE, EVENTS_ROUTE, FEEDBACK_MODAL_ROUTE, IMAGE_VIEW_MODAL_ROUTE,
  INTRO_ROUTE, EXTERNAL_OFFER_ROUTE,
  LANDING_ROUTE, NEWS_ROUTE,
  OFFERS_ROUTE, PDF_VIEW_MODAL_ROUTE,
  POIS_ROUTE, SEARCH_MODAL_ROUTE, SETTINGS_ROUTE
} from './NavigationTypes'
import type { IntroRouteType, DashboardRouteType, LandingRouteType, RoutesParamsType } from './NavigationTypes'
import { cityContentUrl } from '../../common/url'

const transparentHeader = (headerProps: StackHeaderProps) =>
  <TransparentHeaderContainer {...headerProps} />

const settingsHeader = (headerProps: StackHeaderProps) => <SettingsHeaderContainer {...headerProps} />

const defaultHeader = (headerProps: StackHeaderProps) => <HeaderContainer {...headerProps} />

type PropsType = {|
  fetchCategory: (cityCode: string, language: string, key: string, forceUpdate: boolean) => void,
  fetchCities: (forceRefresh: boolean) => void,
  routeKey: ?string,
  routeName: ?string,
  cityCode: ?string,
  languageCode: ?string
|}

type InitialRouteType = {| name: IntroRouteType | LandingRouteType |} |
  {| name: DashboardRouteType, cityCode: string, languageCode: string |}

const Stack = createStackNavigator<RoutesParamsType, *, *>()

const Navigator = (props: PropsType) => {
  const [waitingForSettings, setWaitingForSettings] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<?string>(null)
  const [initialRoute, setInitialRoute] = useState<InitialRouteType>({ name: INTRO_ROUTE })
  const previousRouteKey = useRef(null)
  const previousRouteName = useRef(null)

  const { fetchCities, fetchCategory, routeKey, routeName, cityCode, languageCode } = props

  useEffect(() => {
    fetchCities(false)

    const initialize = async () => {
      if (global.HermesInternal) {
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

      if (!storageVersion) {
        await appSettings.setVersion(ASYNC_STORAGE_VERSION)
      }

      if (storageVersion !== ASYNC_STORAGE_VERSION) {
        // start a migration routine
      }

      if (!contentLanguage) {
        throw Error('The contentLanguage has not been set correctly by I18nProvider!')
      }

      if (!buildConfig().featureFlags.introSlides) {
        await appSettings.setIntroShown()
        await appSettings.setSettings({
          errorTracking: false,
          allowPushNotifications: false,
          proposeNearbyCities: false
        })
      }

      if (buildConfig().featureFlags.introSlides && !introShown) {
        setInitialRoute({ name: INTRO_ROUTE })
      } else {
        if (errorTracking) {
          initSentry()
        }

        if (selectedCity) {
          setInitialRoute({ name: DASHBOARD_ROUTE, cityCode: selectedCity, languageCode: contentLanguage })
        } else {
          setInitialRoute({ name: LANDING_ROUTE })
        }
      }

      setWaitingForSettings(false)
    }
    initialize().catch(error => setErrorMessage(error.message))
  }, [])

  // The following is used to have correct mapping from categories route mapping in redux state to the actual routes
  useEffect(() => {
    // Fetch categories if the initial route is the dashboard route and there was no route before
    // i.e. initial route was set by this component (Navigator)
    if ((!previousRouteKey.current && routeKey && initialRoute.name === DASHBOARD_ROUTE)) {
      fetchCategory(initialRoute.cityCode, initialRoute.languageCode, routeKey, false)
    } else {
      // Fetch categories if new route is the dashboard route and the previous route was the landing route
      // This is necessary because with react-navigation v5 it is not possible anymore to specify the key of a new route
      // https://github.com/react-navigation/react-navigation/issues/8313
      // https://github.com/react-navigation/react-navigation/issues/7685
      if (routeName === DASHBOARD_ROUTE && previousRouteName.current === LANDING_ROUTE &&
        routeKey && cityCode && languageCode
      ) {
        fetchCategory(cityCode, languageCode, routeKey, true)
      }
    }
    previousRouteKey.current = routeKey
    previousRouteName.current = routeName
  }, [routeKey])

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  } else if (waitingForSettings) {
    return null
  }

  const dashboardParams = initialRoute.name === DASHBOARD_ROUTE
    ? {
        cityCode: initialRoute.cityCode,
        languageCode: initialRoute.languageCode,
        shareUrl: cityContentUrl({ cityCode: initialRoute.cityCode, languageCode: initialRoute.languageCode })
      }
    : {}

  // Keeps our previous transition we used in v4 of react-navigation on android. Fixes weird showing of splash screen on every navigate.
  const transitionPreset = Platform.select({
    android: TransitionPresets.FadeFromBottomAndroid,
    ios: TransitionPresets.DefaultTransition
  })

  return (
    <Stack.Navigator initialRouteName={initialRoute.name} headerMode='screen' screenOptions={transitionPreset}>
      <Stack.Screen name={INTRO_ROUTE} component={IntroContainer} options={{ header: () => null }} />
      <Stack.Screen name={LANDING_ROUTE} component={LandingContainer} options={{ header: () => null }} />
      <Stack.Screen name={DASHBOARD_ROUTE} component={DashboardContainer} options={{ header: defaultHeader }} initialParams={dashboardParams} />
      <Stack.Screen name={CATEGORIES_ROUTE} component={CategoriesContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={OFFERS_ROUTE} component={OffersContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={WOHNEN_OFFER_ROUTE} component={WohnenOfferContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={SPRUNGBRETT_OFFER_ROUTE} component={SprungbrettOfferContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={EXTERNAL_OFFER_ROUTE} component={ExternalOfferContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={POIS_ROUTE} component={PoisContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={EVENTS_ROUTE} component={EventsContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={NEWS_ROUTE} component={NewsContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={DISCLAIMER_ROUTE} component={DisclaimerContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={SEARCH_MODAL_ROUTE} component={SearchModalContainer} options={{ header: () => null }} />
      <Stack.Screen name={PDF_VIEW_MODAL_ROUTE} component={PDFViewModal} options={{ header: transparentHeader }} />
      <Stack.Screen name={CHANGE_LANGUAGE_MODAL_ROUTE} component={ChangeLanguageModalContainer} options={{ header: transparentHeader }} />
      <Stack.Screen name={IMAGE_VIEW_MODAL_ROUTE} component={ImageViewModal} options={{ header: transparentHeader }} />
      <Stack.Screen name={FEEDBACK_MODAL_ROUTE} component={FeedbackModalContainer} options={{ header: transparentHeader }} />
      <Stack.Screen name={SETTINGS_ROUTE} component={SettingsContainer} options={{ header: settingsHeader }} />
    </Stack.Navigator>
  )
}

export default Navigator
