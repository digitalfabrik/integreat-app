// @flow

import buildConfig from '../app/constants/buildConfig'
import type { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { IMAGE_VIEW_MODAL_ROUTE, PDF_VIEW_MODAL_ROUTE } from 'api-client/src/routes'
import openExternalUrl from '../common/openExternalUrl'
import Url from 'url-parse'
import type { RouteInformationType } from './createNavigate'
import InternalPathnameParser from './InternalPathnameParser'

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const navigateToLink = <T: RoutesType>(
  url: string,
  navigation: NavigationPropType<T>,
  language: string,
  navigateTo: RouteInformationType => void,
  shareUrl: string
) => {
  if (url.includes('.pdf')) {
    navigation.navigate(PDF_VIEW_MODAL_ROUTE, { url, shareUrl })
  } else if (url.includes('.png') || url.includes('.jpg')) {
    navigation.navigate(IMAGE_VIEW_MODAL_ROUTE, { url, shareUrl })
  } else if (HIJACK.test(url)) {
    const pathname = (new Url(url)).pathname
    // TODO use right fixed city from build config
    const internalUrl = new InternalPathnameParser(pathname, language, null)
    navigateTo(internalUrl.route())
  } else {
    openExternalUrl(url)
  }
}

export default navigateToLink
