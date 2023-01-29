import { useCallback, useContext } from 'react'

import {
  IMAGE_VIEW_MODAL_ROUTE,
  InternalPathnameParser,
  OPEN_INTERNAL_LINK_SIGNAL_NAME,
  OPEN_MEDIA_SIGNAL_NAME,
  PDF_VIEW_MODAL_ROUTE,
  RouteInformationType,
} from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import useNavigate from './useNavigate'
import useSnackbar from './useSnackbar'

const SUPPORTED_IMAGE_FILE_TYPES = ['.jpg', '.jpeg', '.png']

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const navigateToLink = <T extends RoutesType>(
  url: string,
  navigation: NavigationProps<T>,
  languageCode: string,
  navigateTo: (routeInformation: RouteInformationType) => void,
  shareUrl: string,
  showSnackbar: (snackbar: SnackbarType) => void
): void => {
  if (url.includes('.pdf')) {
    sendTrackingSignal({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })
    navigation.navigate(PDF_VIEW_MODAL_ROUTE, {
      url,
      shareUrl,
    })
  } else if (SUPPORTED_IMAGE_FILE_TYPES.some(it => url.includes(it))) {
    sendTrackingSignal({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })
    navigation.navigate(IMAGE_VIEW_MODAL_ROUTE, {
      url,
      shareUrl,
    })
  } else if (HIJACK.test(url)) {
    sendTrackingSignal({
      signal: {
        name: OPEN_INTERNAL_LINK_SIGNAL_NAME,
        url,
      },
    })
    const { pathname } = new URL(url)
    const routeParser = new InternalPathnameParser(pathname, languageCode, buildConfig().featureFlags.fixedCity)
    navigateTo(routeParser.route())
  } else {
    openExternalUrl(url, showSnackbar)
  }
}

const useNavigateToLink = (): ((url: string, shareUrl: string) => void) => {
  const { navigateTo, navigation } = useNavigate()
  const { languageCode } = useContext(AppContext)
  const showSnackbar = useSnackbar()

  return useCallback(
    (url: string, shareUrl: string) =>
      navigateToLink(url, navigation, languageCode, navigateTo, shareUrl, showSnackbar),
    [navigation, navigateTo, languageCode, showSnackbar]
  )
}

export default useNavigateToLink
