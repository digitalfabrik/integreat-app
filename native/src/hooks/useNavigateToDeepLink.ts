import { TFunction } from 'i18next'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Url from 'url-parse'

import { InternalPathnameParser, REGIONS_ROUTE, RouteInformationType } from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContextType } from '../contexts/AppContext'
import useNavigate from './useNavigate'
import { useAppContext } from './useRegionAppContext'
import useSnackbar from './useSnackbar'

type NavigateToDeepLinkParams<T extends RoutesType> = {
  url: string
  navigation: NavigationProps<T>
  navigateTo: (route: RouteInformationType) => void
  showSnackbar: (snackbar: SnackbarType) => void
  appContext: AppContextType
  t: TFunction
}

const navigateToDeepLink = <T extends RoutesType>({
  url,
  navigation,
  navigateTo,
  showSnackbar,
  appContext,
  t,
}: NavigateToDeepLinkParams<T>): void => {
  const { regionCode, languageCode, changeRegionCode } = appContext
  const { fixedRegion } = buildConfig().featureFlags

  const { pathname, query } = new Url(url)
  const routeInformation = new InternalPathnameParser(pathname, languageCode, fixedRegion, query).route()

  if (!routeInformation) {
    showSnackbar({ text: t($ => $.error.notFound.category) })
    return
  }

  const linkRegionCode = (routeInformation as { regionCode?: string }).regionCode

  // Select region of link for the app if there is none selected yet
  const selectedRegionCode = fixedRegion ?? regionCode ?? linkRegionCode
  if (!regionCode && selectedRegionCode) {
    changeRegionCode(selectedRegionCode)
  }

  if (!selectedRegionCode) {
    navigation.reset({ index: 0, routes: [{ name: REGIONS_ROUTE }] })
    if (routeInformation.route !== REGIONS_ROUTE) {
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
  const { t } = useTranslation()

  return useCallback(
    (url: string) => navigateToDeepLink({ url, navigation, navigateTo, appContext, showSnackbar, t }),
    [appContext, navigation, navigateTo, showSnackbar, t],
  )
}

export default useNavigateToDeepLink
