import { useNavigation } from '@react-navigation/native'
import { useCallback, useContext } from 'react'

import {
  BOTTOM_TAB_ROUTE,
  CATEGORIES_ROUTE,
  CATEGORIES_TAB_ROUTE,
  SUGGEST_TO_REGION_ROUTE,
  CONSENT_ROUTE,
  IMPRINT_ROUTE,
  EVENTS_ROUTE,
  REGIONS_ROUTE,
  LICENSES_ROUTE,
  MAIN_IMPRINT_ROUTE,
  NEWS_ROUTE,
  PLACES_ROUTE,
  RouteInformationType,
  SEARCH_ROUTE,
} from 'shared'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import { AppContext, AppContextType } from '../contexts/AppContext'
import { navigateNested } from '../utils/navigation'
import useOpenExternalUrl from '../utils/openExternalUrl'
import { urlFromRouteInformation } from '../utils/url'

type NavigateProps<T extends RoutesType> = {
  routeInformation: RouteInformationType
  navigation: NavigationProps<T>
  appContext: AppContextType
  openExternalUrl: (url: string) => void
  redirect: boolean
}

const navigate = <T extends RoutesType>({
  routeInformation,
  appContext,
  navigation,
  openExternalUrl,
  redirect,
}: NavigateProps<T>): void => {
  if (!routeInformation) {
    return
  }
  const navigate = redirect ? navigation.replace : navigation.push
  const url = urlFromRouteInformation(routeInformation)
  const { route } = routeInformation
  const { regionCode: appRegionCode, languageCode: appLanguageCode } = appContext

  if (
    route === LICENSES_ROUTE ||
    route === CONSENT_ROUTE ||
    route === REGIONS_ROUTE ||
    route === SUGGEST_TO_REGION_ROUTE
  ) {
    navigate(route)
    return
  }

  if (route === MAIN_IMPRINT_ROUTE) {
    openExternalUrl(url)
    return
  }

  const { regionCode, languageCode } = routeInformation

  // Region content routes with different region or language than the currently selected should be opened in the web app
  // This avoids lots of additional complexity by always keeping the region and language of all opened routes in sync
  if ((appRegionCode && appRegionCode !== regionCode) || appLanguageCode !== languageCode) {
    // We need to remove or replace the redirect route if only opening the inappbrowser
    // Otherwise this leads to a blank (redirect) screen when navigating back from the inappbrowser
    if (redirect && navigation.canGoBack()) {
      navigation.pop()
    } else if (redirect) {
      navigation.replace(BOTTOM_TAB_ROUTE, {
        screen: CATEGORIES_TAB_ROUTE,
        params: {
          screen: CATEGORIES_ROUTE,
        },
      })
    }
    openExternalUrl(url)
    return
  }

  switch (routeInformation.route) {
    case CATEGORIES_ROUTE:
      navigateNested(navigation, CATEGORIES_ROUTE, { path: routeInformation.regionContentPath }, redirect)
      return

    case EVENTS_ROUTE:
      navigateNested(navigation, EVENTS_ROUTE, { slug: routeInformation.slug }, redirect)
      return

    case NEWS_ROUTE:
      navigateNested(navigation, NEWS_ROUTE, { id: routeInformation.id ?? null }, redirect)
      return

    case PLACES_ROUTE:
      navigateNested(
        navigation,
        PLACES_ROUTE,
        {
          slug: routeInformation.slug,
          multiPlace: routeInformation.multiPlace,
          zoom: routeInformation.zoom,
          placeCategoryId: routeInformation.placeCategoryId,
        },
        redirect,
      )
      return

    case IMPRINT_ROUTE:
      navigate(IMPRINT_ROUTE)
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
  const appContext = useContext(AppContext)
  const openExternalUrl = useOpenExternalUrl()

  const navigateTo = useCallback(
    (routeInformation: RouteInformationType) =>
      navigate({ routeInformation, navigation, appContext, openExternalUrl, redirect }),
    [navigation, appContext, openExternalUrl, redirect],
  )

  return { navigateTo, navigation }
}

export default useNavigate
