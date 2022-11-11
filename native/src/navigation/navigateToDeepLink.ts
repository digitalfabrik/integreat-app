import { Dispatch } from 'redux'
import Url from 'url-parse'

import {
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME,
} from 'api-client'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { StoreActionType } from '../redux/StoreActionType'
import appSettings, { SettingsType } from '../utils/AppSettings'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import showSnackbar from '../utils/showSnackbar'
import createNavigate from './createNavigate'

const navigateToDeepLink = async <T extends RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationProps<T>,
  url: string,
  language: string
): Promise<void> => {
  const settings: SettingsType = await appSettings.loadSettings()
  const { introShown, selectedCity } = settings
  const { introSlides, fixedCity } = buildConfig().featureFlags

  sendTrackingSignal({
    signal: {
      name: OPEN_DEEP_LINK_SIGNAL_NAME,
      url,
    },
  })

  if (introSlides && !introShown) {
    // Show intro slides first and handle deep link later
    navigation.replace(INTRO_ROUTE, {
      deepLink: url,
    })
    return
  }

  const { pathname } = new Url(url)
  const routeInformation = new InternalPathnameParser(pathname, language, fixedCity).route()

  if (routeInformation?.route === JPAL_TRACKING_ROUTE && buildConfig().featureFlags.jpalTracking) {
    if (routeInformation.trackingCode === null) {
      await appSettings.setJpalTrackingEnabled(false)
    } else {
      await appSettings.setJpalTrackingCode(routeInformation.trackingCode)
    }
  }

  const routeInformationCityCode =
    routeInformation &&
    routeInformation.route !== LANDING_ROUTE &&
    routeInformation.route !== JPAL_TRACKING_ROUTE &&
    routeInformation.route !== CITY_NOT_COOPERATING_ROUTE &&
    routeInformation.route !== LICENSES_ROUTE
      ? routeInformation.cityCode
      : null
  const routeInformationLanguageCode =
    routeInformation &&
    routeInformation.route !== LANDING_ROUTE &&
    routeInformation.route !== JPAL_TRACKING_ROUTE &&
    routeInformation.route !== LICENSES_ROUTE
      ? routeInformation.languageCode
      : null
  // Don't overwrite already selected city
  const selectedCityCode = fixedCity || selectedCity || routeInformationCityCode || null
  const languageCode = routeInformationLanguageCode || language

  if (selectedCityCode && languageCode) {
    // Reset the currently opened screens to just the dashboard of the city and language
    // This is necessary to prevent undefined behaviour for city content routes upon e.g. back navigation
    navigation.reset({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
  } else {
    navigation.replace(LANDING_ROUTE)
  }

  if (!routeInformation) {
    showSnackbar(dispatch, 'notFound.category')
    return
  }

  if (routeInformation.route === LANDING_ROUTE) {
    // Already handled
    return
  }

  const isPeekingCity = routeInformationCityCode && selectedCity && routeInformationCityCode !== selectedCity

  // Only navigate again if either the city of the deep link differs from the currently selected city or
  // it is a city content route which was not handled already, i.e. everything apart from landing and dashboard.
  // TODO IGAPP-636: Fix deep linking and set city code/language code
  if (routeInformation.route !== CATEGORIES_ROUTE || isPeekingCity) {
    createNavigate(navigation, selectedCity, language)(routeInformation)
  }
}

export default navigateToDeepLink
