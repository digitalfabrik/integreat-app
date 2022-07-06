import { Dispatch } from 'redux'

import { CITY_NOT_COOPERATING_ROUTE, NotFoundError, OPEN_PAGE_SIGNAL_NAME, SHELTER_ROUTE } from 'api-client'
import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSE_INFO_ROUTE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER_ROUTE
} from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { StoreActionType } from '../redux/StoreActionType'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import showSnackbar from '../utils/showSnackbar'
import navigateToCategory from './navigateToCategory'
import navigateToCityNotCooperating from './navigateToCityNotCooperating'
import navigateToDisclaimer from './navigateToDisclaimer'
import navigateToEvents from './navigateToEvents'
import navigateToJpalTracking from './navigateToJpalTracking'
import navigateToNews from './navigateToNews'
import navigateToOffers from './navigateToOffers'
import navigateToPois from './navigateToPois'
import navigateToSearch from './navigateToSearch'
import navigateToSprungbrettOffer from './navigateToSprungbrettOffer'
import { urlFromRouteInformation } from './url'

const createNavigate =
  <T extends RoutesType>(dispatch: Dispatch<StoreActionType>, navigation: NavigationPropType<T>) =>
  (routeInformation: RouteInformationType, key?: string, forceRefresh?: boolean): void => {
    if (routeInformation) {
      const url = urlFromRouteInformation(routeInformation)
      if (routeInformation.route !== SHELTER_ROUTE) {
        sendTrackingSignal({
          signal: {
            name: OPEN_PAGE_SIGNAL_NAME,
            pageType: routeInformation.route,
            url
          }
        })
      }

      if (routeInformation.route === LICENSE_INFO_ROUTE) {
        navigation.navigate(LICENSE_INFO_ROUTE)
        return
      }

      if (routeInformation.route === LANDING_ROUTE) {
        navigation.navigate(LANDING_ROUTE)
        return
      }
      if (routeInformation.route === CITY_NOT_COOPERATING_ROUTE) {
        navigateToCityNotCooperating({
          navigation
        })
        return
      }
      if (routeInformation.route === JPAL_TRACKING_ROUTE) {
        if (buildConfig().featureFlags.jpalTracking) {
          navigateToJpalTracking({
            dispatch,
            navigation,
            trackingCode: routeInformation.trackingCode
          })
        }

        return
      }

      const { route, cityCode, languageCode } = routeInformation
      const params = {
        dispatch,
        navigation,
        cityCode,
        languageCode
      }

      switch (routeInformation.route) {
        case CATEGORIES_ROUTE:
        case DASHBOARD_ROUTE:
          navigateToCategory({
            ...params,
            routeName: route === CATEGORIES_ROUTE ? CATEGORIES_ROUTE : DASHBOARD_ROUTE,
            cityContentPath: routeInformation.cityContentPath,
            key,
            forceRefresh
          })
          return

        case DISCLAIMER_ROUTE:
          navigateToDisclaimer(params)
          return

        case EVENTS_ROUTE:
          navigateToEvents({ ...params, cityContentPath: routeInformation.cityContentPath, key, forceRefresh })
          return

        case NEWS_ROUTE:
          if (!buildConfig().featureFlags.newsStream) {
            break
          }

          navigateToNews({
            ...params,
            type: routeInformation.newsType,
            newsId: routeInformation.newsId
          })
          return

        case OFFERS_ROUTE:
          navigateToOffers(params)
          return

        case SPRUNGBRETT_OFFER_ROUTE:
          navigateToSprungbrettOffer(params)
          return

        case POIS_ROUTE:
          if (!buildConfig().featureFlags.pois) {
            break
          }
          navigateToPois({
            ...params,
            urlSlug: routeInformation.urlSlug,
            cityContentPath: routeInformation.cityContentPath,
            key,
            forceRefresh
          })
          return

        case SEARCH_ROUTE:
          navigateToSearch(params)
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
      city: routeInformation?.cityCode ?? ''
    })
    showSnackbar(dispatch, error.message)
  }

export default createNavigate
