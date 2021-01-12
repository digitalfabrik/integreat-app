// @flow

import type { NavigateToInternalLinkParamsType } from './createNavigateToInternalLink'
import buildConfig from './constants/buildConfig'
import type { NavigationPropType, RoutesType } from './constants/NavigationTypes'
import { IMAGE_VIEW_MODAL_ROUTE, PDF_VIEW_MODAL_ROUTE } from './constants/NavigationTypes'
import openExternalUrl from '../common/openExternalUrl'

type NavigateToInternalLinkType = NavigateToInternalLinkParamsType => void

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const navigateToLink = <T: RoutesType>(
  url: string,
  navigation: NavigationPropType<T>,
  language: string,
  navigateToInternalLink: ?NavigateToInternalLinkType,
  shareUrl: string
) => {
  if (url.includes('.pdf')) {
    navigation.navigate(PDF_VIEW_MODAL_ROUTE, { url, shareUrl })
  } else if (url.includes('.png') || url.includes('.jpg')) {
    navigation.navigate(IMAGE_VIEW_MODAL_ROUTE, { url, shareUrl })
  } else if (navigateToInternalLink && HIJACK.test(url)) {
    navigateToInternalLink({ url, language })
  } else {
    openExternalUrl(url)
  }
}

export default navigateToLink
