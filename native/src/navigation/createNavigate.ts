import { Dispatch } from 'redux'

import { CITY_NOT_COOPERATING_ROUTE, NotFoundError, OPEN_PAGE_SIGNAL_NAME, SHELTER_ROUTE } from 'api-client'
import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
} from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { StoreActionType } from '../redux/StoreActionType'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import showSnackbar from '../utils/showSnackbar'
import { urlFromRouteInformation } from './url'

const createNavigate =
  <T extends RoutesType>(dispatch: Dispatch<StoreActionType>, navigation: NavigationProps<T>) =>
  (routeInformation: RouteInformationType): void => {
    if (routeInformation) {
      const url = urlFromRouteInformation(routeInformation)
      if (routeInformation.route !== SHELTER_ROUTE) {
        sendTrackingSignal({
          signal: {
            name: OPEN_PAGE_SIGNAL_NAME,
            pageType: routeInformation.route,
            url,
          },
        })
      }

      if (routeInformation.route === LICENSES_ROUTE) {
        navigation.push(LICENSES_ROUTE)
        return
      }

      if (routeInformation.route === LANDING_ROUTE) {
        navigation.push(LANDING_ROUTE)
        return
      }
      if (routeInformation.route === CITY_NOT_COOPERATING_ROUTE) {
        navigation.push(CITY_NOT_COOPERATING_ROUTE)
        return
      }
      if (routeInformation.route === JPAL_TRACKING_ROUTE) {
        if (buildConfig().featureFlags.jpalTracking) {
          navigation.push(JPAL_TRACKING_ROUTE, {})
        }

        return
      }

      const { cityCode, languageCode } = routeInformation
      const params = {
        cityCode,
        languageCode,
      }

      switch (routeInformation.route) {
        case CATEGORIES_ROUTE:
          navigation.push(CATEGORIES_ROUTE, { path: routeInformation.cityContentPath })
          return

        case DISCLAIMER_ROUTE:
          navigation.push(DISCLAIMER_ROUTE, params)
          return

        case EVENTS_ROUTE:
          navigation.push(EVENTS_ROUTE, { slug: routeInformation.slug })
          return

        case NEWS_ROUTE:
          if (!buildConfig().featureFlags.newsStream) {
            break
          }

          navigation.push(NEWS_ROUTE, {
            ...params,
            newsType: routeInformation.newsType,
            newsId: routeInformation.newsId ?? null,
          })
          return

        case OFFERS_ROUTE:
          navigation.push(OFFERS_ROUTE, params)
          return

        case SPRUNGBRETT_OFFER_ROUTE:
          navigation.push(SPRUNGBRETT_OFFER_ROUTE, params)
          return

        case POIS_ROUTE:
          if (!buildConfig().featureFlags.pois) {
            break
          }
          navigation.push(POIS_ROUTE, { slug: routeInformation.slug })
          return

        case SEARCH_ROUTE:
          navigation.push(SEARCH_ROUTE)
          return

        // Not implemented in native apps, should be opened in InAppBrowser
        case SHELTER_ROUTE:
          openExternalUrl(url)
          return
      }
    }
    const error = new NotFoundError({
      type: 'route',
      id: routeInformation?.route ?? '',
      language: routeInformation?.languageCode ?? 'en',
      city: routeInformation?.cityCode ?? '',
    })
    showSnackbar(dispatch, error.message)
  }

export default createNavigate
