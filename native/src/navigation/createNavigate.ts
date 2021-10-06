import { Dispatch } from 'redux'

import { OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import {
  CATEGORIES_ROUTE,
  DASHBOARD_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
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
import sendTrackingSignal from '../utils/sendTrackingSignal'
import showSnackbar from '../utils/showSnackbar'
import navigateToCategory from './navigateToCategory'
import navigateToDisclaimer from './navigateToDisclaimer'
import navigateToEvents from './navigateToEvents'
import navigateToJpalTracking from './navigateToJpalTracking'
import navigateToLanding from './navigateToLanding'
import navigateToNews from './navigateToNews'
import navigateToOffers from './navigateToOffers'
import navigateToPois from './navigateToPois'
import navigateToSearch from './navigateToSearch'
import navigateToSprungbrettOffer from './navigateToSprungbrettOffer'
import { urlFromRouteInformation } from './url'

const createNavigate = <T extends RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => async (routeInformation: RouteInformationType, key?: string, forceRefresh?: boolean): Promise<void> => {
  if (routeInformation) {
    const url = urlFromRouteInformation(routeInformation)
    sendTrackingSignal({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: routeInformation.route,
        url
      }
    })

    if (routeInformation.route === LANDING_ROUTE) {
      navigateToLanding({
        dispatch,
        navigation
      })
      return
    } else if (routeInformation.route === JPAL_TRACKING_ROUTE) {
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
          newsId: routeInformation.newsId,
          key,
          forceRefresh
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
          selectedPoiId: routeInformation.selectedPoiId,
          cityContentPath: routeInformation.cityContentPath,
          key,
          forceRefresh
        })
        return

      case SEARCH_ROUTE:
        navigateToSearch(params)
        return
    }
  }
  showSnackbar(dispatch, 'This is not a supported route. Skipping.')
}

export default createNavigate
