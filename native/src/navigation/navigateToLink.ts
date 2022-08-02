import Url from 'url-parse'

import { OPEN_INTERNAL_LINK_SIGNAL_NAME, OPEN_MEDIA_SIGNAL_NAME } from 'api-client'
import { IMAGE_VIEW_MODAL_ROUTE, PDF_VIEW_MODAL_ROUTE } from 'api-client/src/routes'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'

import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import openExternalUrl from '../utils/openExternalUrl'
import sendTrackingSignal from '../utils/sendTrackingSignal'

const SUPPORTED_IMAGE_FILE_TYPES = ['.jpg', '.jpeg', '.png']

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const navigateToLink = async <T extends RoutesType>(
  url: string,
  navigation: NavigationPropType<T>,
  language: string,
  navigateTo: (arg0: RouteInformationType) => void,
  shareUrl: string
): Promise<void> => {
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
    const { pathname } = new Url(url)
    const routeParser = new InternalPathnameParser(pathname, language, buildConfig().featureFlags.fixedCity)
    navigateTo(routeParser.route())
  } else {
    openExternalUrl(url)
  }
}

export default navigateToLink
