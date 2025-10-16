import { useCallback, useContext } from 'react'

import {
  IMAGE_VIEW_MODAL_ROUTE,
  InternalPathnameParser,
  OPEN_INTERNAL_LINK_SIGNAL_NAME,
  OPEN_MEDIA_SIGNAL_NAME,
  PDF_VIEW_MODAL_ROUTE,
  RouteInformationType,
} from 'shared'

import { SnackbarType } from '../components/SnackbarContainer'
import { StaticServerContext } from '../components/StaticServerProvider'
import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { getStaticServerFileUrl } from '../utils/helpers'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import useCityAppContext from './useCityAppContext'
import useNavigate from './useNavigate'
import useResourceCache from './useResourceCache'
import useSnackbar from './useSnackbar'

const SUPPORTED_IMAGE_FILE_TYPES = ['.jpg', '.jpeg', '.png']

const internalUrlRegex = new RegExp(buildConfig().internalUrlPattern)

type NavigateToLinkParams<T extends RoutesType> = {
  navigation: NavigationProps<T>
  languageCode: string
  navigateTo: (routeInformation: RouteInformationType) => void
  showSnackbar: (snackbar: SnackbarType) => void
  localUrl: string | null
}

const navigateToLink = <T extends RoutesType>(
  url: string,
  { navigation, languageCode, navigateTo, showSnackbar, localUrl }: NavigateToLinkParams<T>,
): void => {
  if (url.includes('.pdf')) {
    sendTrackingSignal({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })
    navigation.navigate(PDF_VIEW_MODAL_ROUTE, { url, shareUrl: url })
  } else if (SUPPORTED_IMAGE_FILE_TYPES.some(it => url.includes(it))) {
    sendTrackingSignal({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })

    navigation.navigate(IMAGE_VIEW_MODAL_ROUTE, {
      url: localUrl ?? url,
      shareUrl: url,
    })
  } else if (internalUrlRegex.test(url)) {
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

const useNavigateToLink = (): ((url: string) => void) => {
  const { navigateTo, navigation } = useNavigate()
  const { cityCode, languageCode } = useCityAppContext()
  const showSnackbar = useSnackbar()
  const resourceCache = useResourceCache({ cityCode, languageCode })
  const resourceCacheUrl = useContext(StaticServerContext)

  return useCallback(
    (url: string) => {
      const localFilePath = resourceCache[url]?.filePath
      const localUrl = localFilePath ? getStaticServerFileUrl(localFilePath, resourceCacheUrl) : null

      navigateToLink(url, {
        navigation,
        languageCode,
        navigateTo,
        showSnackbar,
        localUrl,
      })
    },

    [navigation, navigateTo, languageCode, showSnackbar, resourceCache, resourceCacheUrl],
  )
}

export default useNavigateToLink
