import {
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  OPEN_PAGE_SIGNAL_NAME,
  POIS_ROUTE,
  RouteInformationType,
  SEARCH_ROUTE,
  SHELTER_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE,
} from 'api-client'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import { urlFromRouteInformation } from './url'

const createNavigate =
  <T extends RoutesType>(navigation: NavigationProps<T>, appCityCode: string | null, appLanguageCode: string) =>
  (routeInformation: RouteInformationType): void => {
    if (!routeInformation) {
      return
    }
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

    // City content routes with different city or language than the currently selected should be opened in the web app
    // This avoids lots of additional complexity by always keeping the city and language of all opened routes in sync
    if ((appCityCode && appCityCode !== cityCode) || appLanguageCode !== languageCode) {
      openExternalUrl(url).catch(reportError)
      return
    }

    switch (routeInformation.route) {
      case CATEGORIES_ROUTE:
        navigation.push(CATEGORIES_ROUTE, { path: routeInformation.cityContentPath })
        return

      case DISCLAIMER_ROUTE:
        navigation.push(DISCLAIMER_ROUTE, {})
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
        navigation.push(OFFERS_ROUTE, {})
        return

      case SPRUNGBRETT_OFFER_ROUTE:
        navigation.push(SPRUNGBRETT_OFFER_ROUTE, {})
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
        openExternalUrl(url).catch(reportError)
    }
  }

export default createNavigate
