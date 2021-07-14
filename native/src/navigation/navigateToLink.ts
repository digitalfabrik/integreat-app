import buildConfig from '../constants/buildConfig'
import { NavigationPropType, RoutesType } from '../constants/NavigationTypes'
import { IMAGE_VIEW_MODAL_ROUTE, PDF_VIEW_MODAL_ROUTE } from 'api-client/src/routes'
import openExternalUrl from '../utils/openExternalUrl'
import Url from 'url-parse'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { OPEN_INTERNAL_LINK_SIGNAL_NAME, OPEN_MEDIA_SIGNAL_NAME } from 'api-client'
const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const navigateToLink = <T extends RoutesType>(
  url: string,
  navigation: NavigationPropType<T>,
  language: string,
  navigateTo: (arg0: RouteInformationType) => void,
  shareUrl: string
): void => {
  if (url.includes('.pdf')) {
    sendTrackingSignal({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url
      }
    })
    navigation.navigate(PDF_VIEW_MODAL_ROUTE, {
      url,
      shareUrl
    })
  } else if (url.includes('.png') || url.includes('.jpg')) {
    sendTrackingSignal({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url
      }
    })
    navigation.navigate(IMAGE_VIEW_MODAL_ROUTE, {
      url,
      shareUrl
    })
  } else if (HIJACK.test(url)) {
    sendTrackingSignal({
      signal: {
        name: OPEN_INTERNAL_LINK_SIGNAL_NAME,
        url
      }
    })
    const pathname = new Url(url).pathname
    const routeParser = new InternalPathnameParser(pathname, language, buildConfig().featureFlags.fixedCity)
    navigateTo(routeParser.route())
  } else {
    openExternalUrl(url)
  }
}

export default navigateToLink
