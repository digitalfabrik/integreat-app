import { NavigationPropType } from '../constants/NavigationTypes'
import { StoreActionType } from '../redux/StoreActionType'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'
import buildConfig from '../constants/buildConfig'
import Url from 'url-parse'
import { Dispatch } from 'redux'
import AppSettings, { SettingsType } from '../services/AppSettings'
import {
  DASHBOARD_ROUTE,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME,
  RouteInformationType
} from 'api-client'
import navigateToCategory from './navigateToCategory'
import { cityContentPath as createCityContentPath } from './url'
import createNavigate from './createNavigate'
import sendTrackingSignal from '../services/sendTrackingSignal'

export const CITY_CODE_PLACEHOLDER = 'city_code_placeholder'
export const LANGUAGE_CODE_PLACEHOLDER = 'language_code_placeholder'

const getDeepLinkCityCode = (routeInformation: RouteInformationType, selectedCity: string | null): string | null => {
  const cityCode =
    routeInformation && routeInformation.route !== LANDING_ROUTE && routeInformation.route !== JPAL_TRACKING_ROUTE
      ? routeInformation.cityCode
      : null
  return cityCode === CITY_CODE_PLACEHOLDER ? selectedCity : cityCode
}

const getDeepLinkLanguageCode = (
  routeInformation: RouteInformationType,
  selectedLanguage: string | null
): string | null => {
  const languageCode =
    routeInformation && routeInformation.route !== LANDING_ROUTE && routeInformation.route !== JPAL_TRACKING_ROUTE
      ? routeInformation.languageCode
      : null
  return languageCode === LANGUAGE_CODE_PLACEHOLDER ? selectedLanguage : languageCode
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
    const pathname = new Url(url).pathname
    const routeParser = new InternalPathnameParser(pathname, language, fixedCity)
    const routeInformation = routeParser.route()

    const deepLinkCityCode = getDeepLinkCityCode(routeInformation, selectedCity)
    const deepLinkLanguageCode = getDeepLinkLanguageCode(routeInformation, language)

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

    if (routeInformation?.route === LANDING_ROUTE) {
      return
    } else if (routeInformation?.route === JPAL_TRACKING_ROUTE) {
      createNavigate(dispatch, navigation)(routeInformation, undefined, false)
      return
    }

    const isPeekingCity = deepLinkCityCode && selectedCity && deepLinkCityCode !== selectedCity

    // Only navigate again if either the city of the deep link differs from the currently selected city or
    // it is a city content route which was not handled already, i.e. everything apart from landing and dashboard.
    if (
      routeInformation &&
      deepLinkCityCode &&
      deepLinkLanguageCode &&
      (routeInformation.route !== DASHBOARD_ROUTE || isPeekingCity)
    ) {
      // Replace placeholders if used
      const finalRouteInformation = {
        ...routeInformation,
        cityCode: deepLinkCityCode,
        languageCode: deepLinkLanguageCode
      }
      createNavigate(dispatch, navigation)(finalRouteInformation, undefined, false)
    }

    if (!routeInformation) {
      console.warn('This is not a supported route. Skipping.') // TODO IGAPP-521 show snackbar route not found
    }
  }
}

export default navigateToDeepLink
