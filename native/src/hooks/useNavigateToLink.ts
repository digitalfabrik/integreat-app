import { useCallback } from 'react'

import { IMAGE_VIEW_MODAL_ROUTE, InternalPathnameParser, PDF_VIEW_MODAL_ROUTE, RouteInformationType } from 'shared'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import useOpenExternalUrl from '../utils/openExternalUrl'
import useNavigate from './useNavigate'
import { useAppContext } from './useRegionAppContext'

const SUPPORTED_IMAGE_FILE_TYPES = ['.jpg', '.jpeg', '.png']

const internalUrlRegex = new RegExp(buildConfig().internalUrlPattern)

type NavigateToLinkParams<T extends RoutesType> = {
  navigation: NavigationProps<T>
  languageCode: string
  navigateTo: (routeInformation: RouteInformationType) => void
  openExternalUrl: (url: string) => void
}

const navigateToLink = <T extends RoutesType>(
  url: string,
  { navigation, languageCode, navigateTo, openExternalUrl }: NavigateToLinkParams<T>,
): void => {
  if (url.includes('.pdf')) {
    navigation.navigate(PDF_VIEW_MODAL_ROUTE, { url, shareUrl: url })
  } else if (SUPPORTED_IMAGE_FILE_TYPES.some(it => url.includes(it))) {
    navigation.navigate(IMAGE_VIEW_MODAL_ROUTE, { url, shareUrl: url })
  } else if (internalUrlRegex.test(url)) {
    const { pathname } = new URL(url)
    const routeParser = new InternalPathnameParser(pathname, languageCode, buildConfig().featureFlags.fixedRegion)
    navigateTo(routeParser.route())
  } else {
    openExternalUrl(url)
  }
}

const useNavigateToLink = (): ((url: string) => void) => {
  const { navigateTo, navigation } = useNavigate()
  const { languageCode } = useAppContext()
  const openExternalUrl = useOpenExternalUrl()

  return useCallback(
    (url: string) => {
      navigateToLink(url, {
        navigation,
        languageCode,
        navigateTo,
        openExternalUrl,
      })
    },

    [navigation, navigateTo, languageCode, openExternalUrl],
  )
}

export default useNavigateToLink
