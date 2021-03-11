// @flow

import buildConfig from '../app/constants/buildConfig'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { IMAGE_VIEW_MODAL_ROUTE, PDF_VIEW_MODAL_ROUTE } from 'api-client/src/routes'
import openExternalUrl from '../common/openExternalUrl'
import Url from 'url-parse'
import type { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import InternalPathnameParser from 'api-client/src/routes/InternalPathnameParser'

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const navigateToLink = <T: RoutesType>(
  url: string,
  navigation: NavigationPropType<T>,
  language: string,
  navigateTo: RouteInformationType => void,
  shareUrl: string
) => {
  if (HIJACK.test(url)) { // TODO check if it still works
    if (url.includes('.pdf')) {
      navigation.navigate(PDF_VIEW_MODAL_ROUTE, { url, shareUrl })
    } else if (url.includes('.png') || url.includes('.jpg')) {
      navigation.navigate(IMAGE_VIEW_MODAL_ROUTE, { url, shareUrl })
    } else {
      const pathname = (new Url(url)).pathname
      const routeParser = new InternalPathnameParser(pathname, language, buildConfig().featureFlags.fixedCity)
      navigateTo(routeParser.route())
    }
  } else {
    openExternalUrl(url)
  }
}

export default navigateToLink
