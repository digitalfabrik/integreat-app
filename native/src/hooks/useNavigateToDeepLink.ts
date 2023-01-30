import { useCallback, useContext } from 'react'
import Url from 'url-parse'

import {
  CATEGORIES_ROUTE,
  CITY_NOT_COOPERATING_ROUTE,
  cityContentPath,
  InternalPathnameParser,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LICENSES_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME,
  RouteInformationType,
} from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import appSettings from '../utils/AppSettings'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import useNavigate from './useNavigate'
import useSnackbar from './useSnackbar'

type NavigateToDeepLinkParams<T extends RoutesType> = {
  url: string
  navigation: NavigationProps<T>
  navigateTo: (route: RouteInformationType) => void
  cityCode: string | null
  languageCode: string
  changeCityCode: (cityCode: string) => void
  showSnackbar: (snackbar: SnackbarType) => void
}

const navigateToDeepLink = async <T extends RoutesType>({
  url,
  navigation,
  navigateTo,
  cityCode,
  languageCode,
  changeCityCode,
  showSnackbar,
}: NavigateToDeepLinkParams<T>): Promise<void> => {
  const { introShown } = await appSettings.loadSettings()
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

  const { pathname } = new Url(url)
  const routeInformation = new InternalPathnameParser(pathname, languageCode, fixedCity).route()

  if (!routeInformation) {
    showSnackbar({ text: 'notFound.category' })
    return
  }

  if (routeInformation.route === JPAL_TRACKING_ROUTE && buildConfig().featureFlags.jpalTracking) {
    if (routeInformation.trackingCode === null) {
      await appSettings.setJpalTrackingEnabled(false)
    } else {
      await appSettings.setJpalTrackingCode(routeInformation.trackingCode)
    }
  }

  const deepLinkCityCode =
    routeInformation.route !== LANDING_ROUTE &&
    routeInformation.route !== JPAL_TRACKING_ROUTE &&
    routeInformation.route !== CITY_NOT_COOPERATING_ROUTE &&
    routeInformation.route !== LICENSES_ROUTE
      ? routeInformation.cityCode
      : null

  // Select city of link for the app if there is none selected yet
  const selectedCityCode = fixedCity ?? cityCode ?? deepLinkCityCode
  if (!cityCode && selectedCityCode) {
    changeCityCode(selectedCityCode)
  }

  // Reset the currently opened screens to just the dashboard of the city and language or the landing page
  // This is necessary to prevent undefined behaviour for city content routes upon e.g. back navigation
  if (selectedCityCode) {
    navigation.reset({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
  } else {
    navigation.reset({ index: 0, routes: [{ name: LANDING_ROUTE }] })
  }

  const dashboardPath = selectedCityCode ? cityContentPath({ cityCode: selectedCityCode, languageCode }) : null
  const isDashboard = routeInformation.route === CATEGORIES_ROUTE && routeInformation.cityContentPath === dashboardPath

  if (routeInformation.route === LANDING_ROUTE || isDashboard) {
    // Already handled
    return
  }

  navigateTo(routeInformation)
}

const useNavigateToDeepLink = (): ((url: string) => void) => {
  const showSnackbar = useSnackbar()
  const appContext = useContext(AppContext)
  const { navigation, navigateTo } = useNavigate()

  return useCallback(
    async (url: string) =>
      navigateToDeepLink({ url, navigation, navigateTo, ...appContext, showSnackbar }).catch(reportError),
    [appContext, navigation, navigateTo, showSnackbar]
  )
}

export default useNavigateToDeepLink
