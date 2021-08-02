import { NavigationPropType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'
import buildConfig from '../constants/buildConfig'
import Url from 'url-parse'
import { Dispatch } from 'redux'
import AppSettings, { SettingsType } from '../utils/AppSettings'
import {
  DASHBOARD_ROUTE,
  INTRO_ROUTE,
  LANDING_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME,
  RouteInformationType
} from 'api-client'
import navigateToCategory from './navigateToCategory'
import { cityContentPath as createCityContentPath } from './url'
import createNavigate from './createNavigate'
import sendTrackingSignal from '../utils/sendTrackingSignal'

export const CITY_CODE_PLACEHOLDER = 'city_code_placeholder'
export const LANGUAGE_CODE_PLACEHOLDER = 'language_code_placeholder'

const getRouteInformation = (url: string, language: string, selectedCity: string | null): RouteInformationType => {
  const fixedCity = buildConfig().featureFlags.fixedCity
  const pathname = new Url(url).pathname
  const routeParser = new InternalPathnameParser(pathname, language, fixedCity)
  const routeInformation = routeParser.route()

  const newSelectedCity = fixedCity || selectedCity

  if (routeInformation?.cityContentRoute && routeInformation.cityCode === CITY_CODE_PLACEHOLDER) {
    if (!newSelectedCity) {
      return null
    }
    // Replace empty cityCode and languageCode (placeholders)
    const languageCode =
      routeInformation.languageCode === LANGUAGE_CODE_PLACEHOLDER ? language : routeInformation.languageCode
    return { ...routeInformation, cityCode: newSelectedCity, languageCode }
  }
  return routeInformation
}

const navigateToDeepLink = async (
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<any>,
  url: string,
  language: string
): Promise<void> => {
  const appSettings = new AppSettings()
  const settings: SettingsType = await appSettings.loadSettings()
  const { introShown, selectedCity } = settings
  const { introSlides, fixedCity } = buildConfig().featureFlags

  sendTrackingSignal({
    signal: {
      name: OPEN_DEEP_LINK_SIGNAL_NAME,
      url
    }
  })

  if (introSlides && !introShown) {
    // Show intro slides first and handle deep link later
    navigation.replace(INTRO_ROUTE, {
      deepLink: url
    })
  } else {
    const routeInformation = getRouteInformation(url, language, selectedCity)

    const deepLinkCityCode = routeInformation?.cityContentRoute ? routeInformation.cityCode : null
    const deepLinkLanguageCode = routeInformation?.cityContentRoute ? routeInformation.languageCode : null

    // Don't overwrite already selected city
    const selectedCityCode = fixedCity || selectedCity || deepLinkCityCode || null
    const languageCode = deepLinkLanguageCode || language

    if (selectedCityCode && languageCode) {
      // Reset the currently opened screens to just the dashboard of the city and language
      // This is necessary to prevent undefined behaviour for city content routes upon e.g. back navigation
      navigateToCategory({
        dispatch,
        navigation,
        cityCode: selectedCityCode,
        languageCode,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: createCityContentPath({
          cityCode: selectedCityCode,
          languageCode
        }),
        forceRefresh: false,
        resetNavigation: true
      })
    } else {
      navigation.replace(LANDING_ROUTE)
    }

    if (!routeInformation) {
      console.warn('This is not a supported route. Skipping.') // TODO IGAPP-521 show snackbar route not found
      return
    }

    if (routeInformation.route === LANDING_ROUTE) {
      // Already handled
      return
    }

    const isPeekingCity = deepLinkCityCode && selectedCity && deepLinkCityCode !== selectedCity

    // Only navigate again if either the city of the deep link differs from the currently selected city or
    // it is a city content route which was not handled already, i.e. everything apart from landing and dashboard.
    if (routeInformation.route !== DASHBOARD_ROUTE || isPeekingCity) {
      createNavigate(dispatch, navigation)(routeInformation, undefined, false)
    }
  }
}

export default navigateToDeepLink
