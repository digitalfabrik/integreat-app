// @flow

import { Linking } from 'react-native'
import type { NavigateToInternalLinkParamsType } from '../app/createNavigateToInternalLink'
import buildConfig from '../app/constants/buildConfig'
import type { NavigationPropType, RoutesType } from '../app/components/NavigationTypes'

type NavigateToInternalLinkType = NavigateToInternalLinkParamsType => void

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const onInternalLinkPress = <T: RoutesType>(url: string,
  navigation: NavigationPropType<T>,
  language: string,
  navigateToInternalLink: ?NavigateToInternalLinkType,
  shareUrl?: string) => {
  if (url.includes('.pdf')) {
    navigation.navigate('PDFViewModal', { url, shareUrl })
  } else if (url.includes('.png') || url.includes('.jpg')) {
    navigation.navigate('ImageViewModal', { url, shareUrl })
  } else if (navigateToInternalLink && HIJACK.test(url)) {
    navigateToInternalLink({
      url,
      language
    })
  } else {
    Linking.openURL(url).catch(err => console.error('An error occurred', err))
  }
}

export default onInternalLinkPress
