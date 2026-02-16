import { useCallback } from 'react'
import Url from 'url-parse'

import {
  BOTTOM_TAB_NAVIGATION_ROUTE,
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  cityContentPath,
  CONSENT_ROUTE,
  EVENTS_ROUTE,
  InternalPathnameParser,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  NEWS_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME,
  POIS_ROUTE,
  RouteInformationType,
} from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContextType } from '../contexts/AppContextProvider'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { useAppContext } from './useCityAppContext'
import useNavigate from './useNavigate'
import useSnackbar from './useSnackbar'

type NavigateToDeepLinkParams<T extends RoutesType> = {
  url: string
  navigation: NavigationProps<T>
  navigateTo: (route: RouteInformationType) => void
  showSnackbar: (snackbar: SnackbarType) => void
  appContext: AppContextType
}

const buildTabRouteState = (
  routeInformation: RouteInformationType,
): { tabName: string; params: Record<string, unknown> } | null => {
  if (!routeInformation) {
    return null
  }
  switch (routeInformation.route) {
    case CATEGORIES_ROUTE:
      return { tabName: CATEGORIES_ROUTE, params: { path: routeInformation.cityContentPath } }
    case EVENTS_ROUTE:
      return { tabName: EVENTS_ROUTE, params: { slug: routeInformation.slug } }
    case NEWS_ROUTE:
      return {
        tabName: NEWS_ROUTE,
        params: { newsType: routeInformation.newsType, newsId: routeInformation.newsId ?? null },
      }
    case POIS_ROUTE:
      return {
        tabName: POIS_ROUTE,
        params: {
          slug: routeInformation.slug,
          multipoi: routeInformation.multipoi,
          zoom: routeInformation.zoom,
          poiCategoryId: routeInformation.poiCategoryId,
        },
      }
    default:
      return null
  }
}

const navigateToDeepLink = <T extends RoutesType>({
  url,
  navigation,
  navigateTo,
  showSnackbar,
  appContext,
}: NavigateToDeepLinkParams<T>): void => {
  const { settings, cityCode, languageCode, changeCityCode, updateSettings } = appContext
  const { introShown } = settings
  const { introSlides, fixedCity } = buildConfig().featureFlags

  sendTrackingSignal({
    signal: {
      name: OPEN_DEEP_LINK_SIGNAL_NAME,
      url,
    },
  })

  if (introSlides && !introShown) {
    // Show intro slides first and handle deep link later
    navigation.replace(INTRO_ROUTE, { deepLink: url })
    return
  }

  const { pathname, query } = new Url(url)
  const routeInformation = new InternalPathnameParser(pathname, languageCode, fixedCity, query).route()

  if (!routeInformation) {
    showSnackbar({ text: 'notFound.category' })
    return
  }

  if (routeInformation.route === JPAL_TRACKING_ROUTE && buildConfig().featureFlags.jpalTracking) {
    if (routeInformation.trackingCode === null) {
      updateSettings({ jpalTrackingEnabled: false })
    } else {
      updateSettings({ jpalTrackingCode: routeInformation.trackingCode })
    }
  }

  const deepLinkCityCode =
    routeInformation.route !== LANDING_ROUTE &&
    routeInformation.route !== JPAL_TRACKING_ROUTE &&
    routeInformation.route !== CITY_NOT_COOPERATING_ROUTE &&
    routeInformation.route !== LICENSES_ROUTE &&
    routeInformation.route !== CONSENT_ROUTE
      ? routeInformation.cityCode
      : null

  if (
    deepLinkCityCode &&
    (cityCode !== deepLinkCityCode || languageCode !== (routeInformation as { languageCode: string }).languageCode)
  ) {
    navigateTo(routeInformation)
    return
  }

  // Select city of link for the app if there is none selected yet
  const selectedCityCode = fixedCity ?? cityCode ?? deepLinkCityCode
  if (!cityCode && selectedCityCode) {
    changeCityCode(selectedCityCode)
  }

  if (!selectedCityCode) {
    navigation.reset({ index: 0, routes: [{ name: LANDING_ROUTE }] })
    if (routeInformation.route !== LANDING_ROUTE) {
      navigateTo(routeInformation)
    }
    return
  }

  const dashboardPath = cityContentPath({ cityCode: selectedCityCode, languageCode })
  const isDashboard = routeInformation.route === CATEGORIES_ROUTE && routeInformation.cityContentPath === dashboardPath

  if (routeInformation.route === LANDING_ROUTE || isDashboard) {
    navigation.reset({ index: 0, routes: [{ name: BOTTOM_TAB_NAVIGATION_ROUTE, params: {} }] })
    return
  }

  const tabRouteState = buildTabRouteState(routeInformation)
  if (tabRouteState) {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: BOTTOM_TAB_NAVIGATION_ROUTE,
          params: {},
          state: {
            routes: [
              {
                name: tabRouteState.tabName,
                state: {
                  routes: [
                    { name: tabRouteState.tabName },
                    { name: tabRouteState.tabName, params: tabRouteState.params },
                  ],
                  index: 1,
                },
              },
            ],
          },
        },
      ],
    })
    return
  }

  // Fallback for non-tab routes (e.g. disclaimer, search)
  navigation.reset({ index: 0, routes: [{ name: BOTTOM_TAB_NAVIGATION_ROUTE, params: {} }] })
  navigateTo(routeInformation)
}

const useNavigateToDeepLink = ({ redirect } = { redirect: false }): ((url: string) => void) => {
  const showSnackbar = useSnackbar()
  const appContext = useAppContext()
  const { navigation, navigateTo } = useNavigate({ redirect })

  return useCallback(
    (url: string) => navigateToDeepLink({ url, navigation, navigateTo, appContext, showSnackbar }),
    [appContext, navigation, navigateTo, showSnackbar],
  )
}

export default useNavigateToDeepLink
