import { StackActions, useNavigation } from '@react-navigation/native'
import { useCallback, useContext } from 'react'

import {
  BOTTOM_TAB_NAVIGATION_ROUTE,
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  CONSENT_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  NEWS_ROUTE,
  OPEN_PAGE_SIGNAL_NAME,
  POIS_ROUTE,
  RouteInformationType,
  SEARCH_ROUTE,
} from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import { NAVIGATION_INITIALIZATION_DELAY } from '../constants'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import { urlFromRouteInformation } from '../navigation/url'
import { buildNestedAction } from '../utils/navigation'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import useSnackbar from './useSnackbar'

const navigate = <T extends RoutesType>(
  routeInformation: RouteInformationType,
  navigation: NavigationProps<T>,
  appCityCode: string | null,
  appLanguageCode: string,
  showSnackbar: (snackbar: SnackbarType) => void,
  redirect: boolean,
): void => {
  if (!routeInformation) {
    return
  }
  const url = urlFromRouteInformation(routeInformation)
  sendTrackingSignal({
    signal: {
      name: OPEN_PAGE_SIGNAL_NAME,
      pageType: routeInformation.route,
      url,
    },
  })
  const navigate = (routeName: string, params?: object) => {
    if (redirect) {
      const routes: { name: string; params?: object }[] = appCityCode ? [{ name: BOTTOM_TAB_NAVIGATION_ROUTE }] : []
      if (routeName !== BOTTOM_TAB_NAVIGATION_ROUTE || !appCityCode) {
        routes.push({ name: routeName, params })
      }
      navigation.reset({ index: routes.length - 1, routes: routes as never })
    } else if (routeName === BOTTOM_TAB_NAVIGATION_ROUTE) {
      navigation.navigate(BOTTOM_TAB_NAVIGATION_ROUTE, params as never)
    } else {
      navigation.dispatch(StackActions.push(routeName, params))
    }
  }

  const navigateToNestedRoute = (routeName: RoutesType, params: Record<string, unknown>) => {
    const { routes, index } = navigation.getState()

    // Already inside the matching tab stack (e.g., categories -> subcategory), push directly
    if (routes[index]?.name === routeName) {
      navigate(routeName, params)
      return
    }

    const bottomTabKey = routes.find(r => r.name === BOTTOM_TAB_NAVIGATION_ROUTE)?.key
    navigation.reset(buildNestedAction(routeName, params, bottomTabKey))
  }

  if (routeInformation.route === LICENSES_ROUTE) {
    navigate(LICENSES_ROUTE)
    return
  }
  if (routeInformation.route === CONSENT_ROUTE) {
    navigate(CONSENT_ROUTE)
    return
  }
  if (routeInformation.route === LANDING_ROUTE) {
    navigate(LANDING_ROUTE)
    return
  }
  if (routeInformation.route === CITY_NOT_COOPERATING_ROUTE) {
    navigate(CITY_NOT_COOPERATING_ROUTE)
    return
  }
  if (routeInformation.route === JPAL_TRACKING_ROUTE) {
    if (buildConfig().featureFlags.jpalTracking) {
      navigate(JPAL_TRACKING_ROUTE)
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
    if (redirect) {
      navigate(appCityCode ? BOTTOM_TAB_NAVIGATION_ROUTE : LANDING_ROUTE)
    }
    setTimeout(() => openExternalUrl(url, showSnackbar), NAVIGATION_INITIALIZATION_DELAY)
    return
  }

  switch (routeInformation.route) {
    case CATEGORIES_ROUTE:
      navigateToNestedRoute(CATEGORIES_ROUTE, { path: routeInformation.cityContentPath })
      return

    case DISCLAIMER_ROUTE:
      navigate(DISCLAIMER_ROUTE)
      return

    case EVENTS_ROUTE:
      navigateToNestedRoute(EVENTS_ROUTE, { slug: routeInformation.slug })
      return

    case NEWS_ROUTE:
      if (!buildConfig().featureFlags.newsStream) {
        break
      }
      navigateToNestedRoute(NEWS_ROUTE, {
        ...params,
        newsType: routeInformation.newsType,
        newsId: routeInformation.newsId ?? null,
      })
      return

    case POIS_ROUTE:
      if (!buildConfig().featureFlags.pois) {
        break
      }
      navigateToNestedRoute(POIS_ROUTE, {
        slug: routeInformation.slug,
        multipoi: routeInformation.multipoi,
        zoom: routeInformation.zoom,
        poiCategoryId: routeInformation.poiCategoryId,
      })
      return

    case SEARCH_ROUTE:
      navigate(SEARCH_ROUTE, { searchText: routeInformation.searchText })
  }
}

type UseNavigateReturn = {
  navigateTo: (routeInformation: RouteInformationType) => void
  navigation: NavigationProps<RoutesType>
}

const useNavigate = ({ redirect } = { redirect: false }): UseNavigateReturn => {
  const navigation = useNavigation<NavigationProps<RoutesType>>()
  const { cityCode, languageCode } = useContext(AppContext)
  const showSnackbar = useSnackbar()

  const navigateTo = useCallback(
    (routeInformation: RouteInformationType) =>
      navigate(routeInformation, navigation, cityCode, languageCode, showSnackbar, redirect),
    [navigation, cityCode, languageCode, showSnackbar, redirect],
  )

  return { navigateTo, navigation }
}

export default useNavigate
