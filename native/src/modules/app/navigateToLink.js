// @flow

import { Linking } from 'react-native'
import type { NavigateToInternalLinkParamsType } from './createNavigateToInternalLink'
import buildConfig from './constants/buildConfig'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { IMAGE_VIEW_MODAL_ROUTE, PDF_VIEW_MODAL_ROUTE } from './components/NavigationTypes'

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
    Linking.openURL(url).catch(err => console.error('An error occurred', err))
  }
}

export default navigateToLink
