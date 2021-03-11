// @flow

import type { StoreActionType } from '../app/StoreActionType'
import type { Dispatch } from 'redux'
import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  LANDING_ROUTE, LOCAL_NEWS_TYPE,
  NEWS_ROUTE, OFFERS_ROUTE, POIS_ROUTE, SEARCH_ROUTE
} from 'api-client/src/routes'
import navigateToDisclaimer from './navigateToDisclaimer'
import navigateToLanding from './navigateToLanding'
import navigateToOffers from './navigateToOffers'
import navigateToEvents from './navigateToEvents'
import navigateToPois from './navigateToPois'
import navigateToSearch from './navigateToSearch'
import navigateToNews from './navigateToNews'
import navigateToCategory from './navigateToCategory'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import buildConfig from '../app/constants/buildConfig'
import type { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import { cityContentPath as createCityContentPath } from './url'

const createNavigate = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  reset: boolean = false
) => (
    routeInformation: RouteInformationType,
    key?: string,
    forceRefresh?: boolean
  ) => {
    if (routeInformation) {
      if (routeInformation.route === LANDING_ROUTE) {
        navigateToLanding({ dispatch, navigation })
        return
      }

      const { route, cityCode, languageCode } = routeInformation
      const cityContentPath = routeInformation.cityContentPath || null
      const params = { dispatch, navigation, cityCode, languageCode }

      if (reset && route !== DASHBOARD_ROUTE) {
        // Reset the currently opened screens to just the dashboard of the corresponding city and language
        // This is necessary to prevent undefined behaviour for city content routes upon e.g. back navigation
        // Primarily used in combination with deep linking
        navigateToCategory({
          ...params,
          routeName: DASHBOARD_ROUTE,
          cityContentPath: createCityContentPath({ cityCode, languageCode }),
          forceRefresh,
          reset: true
        })
      }

      switch (route) {
        case CATEGORIES_ROUTE:
        case DASHBOARD_ROUTE:
          if (!cityContentPath) {
            break
          }
          navigateToCategory({
            ...params,
            routeName: route === CATEGORIES_ROUTE ? CATEGORIES_ROUTE : DASHBOARD_ROUTE,
            cityContentPath,
            key,
            forceRefresh
          })
          return
        case DISCLAIMER_ROUTE:
          navigateToDisclaimer(params)
          return
        case EVENTS_ROUTE:
          navigateToEvents({ ...params, cityContentPath, key, forceRefresh })
          return
        case NEWS_ROUTE:
          if (!buildConfig().featureFlags.newsStream) {
            break
          }
          navigateToNews({
            ...params,
            type: routeInformation.newsType || LOCAL_NEWS_TYPE,
            newsId: routeInformation.newsId || null,
            key,
            forceRefresh
          })
          return
        case OFFERS_ROUTE:
          navigateToOffers(params)
          return
        case POIS_ROUTE:
          if (!buildConfig().featureFlags.pois) {
            break
          }
          navigateToPois({ ...params, cityContentPath, key, forceRefresh })
          return
        case SEARCH_ROUTE:
          navigateToSearch(params)
          return
      }
    }

    console.warn('This is not a supported route. Skipping.')
    // TODO Show a snackbar
  }

export default createNavigate
