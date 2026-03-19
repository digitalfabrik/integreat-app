import { useNavigation } from '@react-navigation/native'
import { useCallback, useContext } from 'react'

import {
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
import { navigateNested } from '../utils/navigation'
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
  const navigate = redirect ? navigation.replace : navigation.push
  const url = urlFromRouteInformation(routeInformation)
  const { route } = routeInformation
  sendTrackingSignal({
    signal: {
      name: OPEN_PAGE_SIGNAL_NAME,
      pageType: routeInformation.route,
      url,
    },
  })

  if (
    route === LICENSES_ROUTE ||
    route === CONSENT_ROUTE ||
    route === LANDING_ROUTE ||
    route === CITY_NOT_COOPERATING_ROUTE
  ) {
    navigate(route)
    return
  }

  if (routeInformation.route === JPAL_TRACKING_ROUTE) {
    if (buildConfig().featureFlags.jpalTracking) {
      navigate(JPAL_TRACKING_ROUTE)
    }
    return
  }

  const { cityCode, languageCode } = routeInformation

  // City content routes with different city or language than the currently selected should be opened in the web app
  // This avoids lots of additional complexity by always keeping the city and language of all opened routes in sync
  if ((appCityCode && appCityCode !== cityCode) || appLanguageCode !== languageCode) {
    setTimeout(() => openExternalUrl(url, showSnackbar), NAVIGATION_INITIALIZATION_DELAY)
    return
  }

  switch (routeInformation.route) {
    case CATEGORIES_ROUTE:
      navigateNested(navigation, CATEGORIES_ROUTE, { path: routeInformation.cityContentPath }, redirect)
      return

    case EVENTS_ROUTE:
      navigateNested(navigation, EVENTS_ROUTE, { slug: routeInformation.slug }, redirect)
      return

    case NEWS_ROUTE:
      if (!buildConfig().featureFlags.newsStream) {
        break
      }
      navigateNested(
        navigation,
        NEWS_ROUTE,
        {
          newsType: routeInformation.newsType,
          newsId: routeInformation.newsId ?? null,
        },
        redirect,
      )
      return

    case POIS_ROUTE:
      if (!buildConfig().featureFlags.pois) {
        break
      }
      navigateNested(
        navigation,
        POIS_ROUTE,
        {
          slug: routeInformation.slug,
          multipoi: routeInformation.multipoi,
          zoom: routeInformation.zoom,
          poiCategoryId: routeInformation.poiCategoryId,
        },
        redirect,
      )
      return

    case DISCLAIMER_ROUTE:
      navigate(DISCLAIMER_ROUTE)
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
