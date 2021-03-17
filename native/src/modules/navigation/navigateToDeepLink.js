// @flow

import type { NavigationPropType } from '../app/constants/NavigationTypes'
import type { StoreActionType } from '../app/StoreActionType'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'
import buildConfig from '../app/constants/buildConfig'
import Url from 'url-parse'
import type { Dispatch } from 'redux'
import AppSettings from '../settings/AppSettings'
import { DASHBOARD_ROUTE, INTRO_ROUTE, LANDING_ROUTE } from 'api-client'
import navigateToCategory from './navigateToCategory'
import { cityContentPath as createCityContentPath } from './url'
import createNavigate from './createNavigate'
import type { SettingsType } from '../settings/AppSettings'

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

  if (introSlides && !introShown) {
    // Show intro slides first and handle deep link later
    navigation.replace(INTRO_ROUTE, { deepLink: url })
  } else {
    const pathname = new Url(url).pathname
    const routeParser = new InternalPathnameParser(pathname, language, fixedCity)
    const routeInformation = routeParser.route()

    // Don't overwrite already selected city
    const selectedCityCode = fixedCity || selectedCity || routeInformation?.cityCode || null
    const languageCode = routeInformation?.languageCode || language

    if (selectedCityCode && languageCode) {
      // Reset the currently opened screens to just the dashboard of the  city and language
      // This is necessary to prevent undefined behaviour for city content routes upon e.g. back navigation
      navigateToCategory({
        dispatch,
        navigation,
        cityCode: selectedCityCode,
        languageCode,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: createCityContentPath({ cityCode: selectedCityCode, languageCode }),
        forceRefresh: false,
        resetNavigation: true
      })

      const isPeekingCity = routeInformation?.cityCode && selectedCity && routeInformation.cityCode !== selectedCity

      // Only navigate again if either the city of the deep link differs from the currently selected city or
      // it is a city content route which was not handled already, i.e. everything apart from landing and dashboard.
      if (routeInformation && (![LANDING_ROUTE, DASHBOARD_ROUTE].includes(routeInformation.route) || isPeekingCity)) {
        createNavigate(dispatch, navigation)(routeInformation, undefined, false)
      }
    } else {
      navigation.replace(LANDING_ROUTE)
    }

    if (!routeInformation) {
      console.warn('This is not a supported route. Skipping.')
      // TODO IGAPP-521 show snackbar route not found
    }
  }
}

export default navigateToDeepLink
