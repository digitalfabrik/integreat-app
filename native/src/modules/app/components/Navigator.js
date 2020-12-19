// @flow

import React, { useState, useEffect } from 'react'
import AppSettings from '../../settings/AppSettings'
import { Text } from 'react-native'
import initSentry from '../initSentry'
import { ASYNC_STORAGE_VERSION } from '../../settings/constants'
import buildConfig from '../constants/buildConfig'
import { createStackNavigator, type StackHeaderProps } from '@react-navigation/stack'
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
import { generateKey } from '../generateRouteKey'
import { cityContentUrl } from '../../common/url'

const transparentStaticHeader = (headerProps: StackHeaderProps) =>
  <TransparentHeaderContainer {...headerProps} float={false} />

const transparentFloatingHeader = (headerProps: StackHeaderProps) =>
  <TransparentHeaderContainer {...headerProps} float />

const settingsHeader = (headerProps: StackHeaderProps) => <SettingsHeaderContainer {...headerProps} />

const defaultHeader = (headerProps: StackHeaderProps) => <HeaderContainer {...headerProps} />

type PropsType = {|
  fetchCategory: (cityCode: string, language: string, key: string) => void,
  fetchCities: (forceRefresh: boolean) => void
|}

type InitialRouteType = {| name: IntroRouteType | LandingRouteType |} |
  {| name: DashboardRouteType, shareUrl: string |}

const Stack = createStackNavigator<RoutesParamsType, *, *>()

const Navigator = (props: PropsType) => {
  const [waitingForSettings, setWaitingForSettings] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<?string>(null)
  const [initialRoute, setInitialRoute] = useState<InitialRouteType>({ name: INTRO_ROUTE })

  const { fetchCities, fetchCategory } = props

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
          fetchCategory(selectedCity, contentLanguage, generateKey())
          const shareUrl = cityContentUrl({ cityCode: selectedCity, languageCode: contentLanguage})
          setInitialRoute({ name: DASHBOARD_ROUTE, shareUrl })
        } else {
          setInitialRoute({ name: LANDING_ROUTE })
        }
      }

      setWaitingForSettings(false)
    }
    initialize().catch(error => setErrorMessage(error.message))
  }, [])

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  } else if (waitingForSettings) {
    return null
  }

  // TODO Snackbar
  const shareUrl = initialRoute.name === DASHBOARD_ROUTE ? initialRoute.shareUrl : null
  return (
    <Stack.Navigator initialRouteName={initialRoute.name}>
      <Stack.Screen name={INTRO_ROUTE} component={IntroContainer} options={{ header: () => null }} />
      <Stack.Screen name={LANDING_ROUTE} component={LandingContainer} options={{ header: () => null }} />
      <Stack.Screen name={DASHBOARD_ROUTE} component={DashboardContainer} options={{ header: defaultHeader }} initialParams={{ shareUrl }} />
      <Stack.Screen name={CATEGORIES_ROUTE} component={CategoriesContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={OFFERS_ROUTE} component={OffersContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={WOHNEN_OFFER_ROUTE} component={WohnenOfferContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={SPRUNGBRETT_OFFER_ROUTE} component={SprungbrettOfferContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={EXTERNAL_OFFER_ROUTE} component={ExternalOfferContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={POIS_ROUTE} component={PoisContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={EVENTS_ROUTE} component={EventsContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={NEWS_ROUTE} component={NewsContainer} options={{ header: defaultHeader }} />
      <Stack.Screen name={PDF_VIEW_MODAL_ROUTE} component={PDFViewModal} options={{ header: transparentFloatingHeader }} />
      <Stack.Screen name={CHANGE_LANGUAGE_MODAL_ROUTE} component={ChangeLanguageModalContainer} options={{ header: transparentStaticHeader }} />
      <Stack.Screen name={SEARCH_MODAL_ROUTE} component={SearchModalContainer} options={{ header: () => null }} />
      <Stack.Screen name={IMAGE_VIEW_MODAL_ROUTE} component={ImageViewModal} options={{ header: transparentFloatingHeader }} />
      <Stack.Screen name={FEEDBACK_MODAL_ROUTE} component={FeedbackModalContainer} options={{ header: transparentFloatingHeader }} />
      <Stack.Screen name={SETTINGS_ROUTE} component={SettingsContainer} options={{ header: settingsHeader }} />
      <Stack.Screen name={DISCLAIMER_ROUTE} component={DisclaimerContainer} options={{ header: defaultHeader }} />
    </Stack.Navigator>
  )
}

export default Navigator
