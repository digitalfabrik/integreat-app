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
  const pathname = new Url(url).pathname
  const routeParser = new InternalPathnameParser(pathname, language, buildConfig().featureFlags.fixedCity)
  const routeInformation = routeParser.route()

  const appSettings = new AppSettings()
  const settings: SettingsType = await appSettings.loadSettings()
  const { introShown, selectedCity, contentLanguage } = settings

  const cityCode = buildConfig().featureFlags.fixedCity || routeInformation?.cityCode || selectedCity
  const languageCode = routeInformation?.languageCode || contentLanguage

  if (buildConfig().featureFlags.introSlides && !introShown) {
    // Show intro slides first and handle deep link later
    navigation.replace(INTRO_ROUTE, { deepLink: url })
  } else {
    if (!cityCode || !languageCode) {
      navigation.replace(LANDING_ROUTE)
    } else {
      // Reset the currently opened screens to just the dashboard of the corresponding city and language
      // This is necessary to prevent undefined behaviour for city content routes upon e.g. back navigation
      navigateToCategory({
        dispatch,
        navigation,
        cityCode,
        languageCode,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: createCityContentPath({ cityCode, languageCode }),
        forceRefresh: true,
        reset: true
      })

      // Dashboard route was already handled with reset above
      if (routeInformation && routeInformation.route !== DASHBOARD_ROUTE) {
        createNavigate(dispatch, navigation)(routeInformation, undefined, false)
      }
    }
  }
}

export default navigateToDeepLink
