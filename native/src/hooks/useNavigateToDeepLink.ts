import { useCallback } from 'react'
import Url from 'url-parse'

import { InternalPathnameParser, LANDING_ROUTE, RouteInformationType } from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContextType } from '../contexts/AppContextProvider'
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

const navigateToDeepLink = <T extends RoutesType>({
  url,
  navigation,
  navigateTo,
  showSnackbar,
  appContext,
}: NavigateToDeepLinkParams<T>): void => {
  const { cityCode, languageCode, changeCityCode } = appContext
  const { fixedCity } = buildConfig().featureFlags

  const { pathname, query } = new Url(url)
  const routeInformation = new InternalPathnameParser(pathname, languageCode, fixedCity, query).route()

  if (!routeInformation) {
    showSnackbar({ text: 'notFound.category' })
    return
  }

  const linkCityCode = (routeInformation as { cityCode?: string }).cityCode

  // Select city of link for the app if there is none selected yet
  const selectedCityCode = fixedCity ?? cityCode ?? linkCityCode
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
