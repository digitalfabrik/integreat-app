// @flow

import { Linking } from 'react-native'
import type { NavigateToInternalLinkParamsType } from '../app/createNavigateToInternalLink'
import buildConfig from '../app/constants/buildConfig'
import type { NavigationStackProp } from 'react-navigation-stack'

type NavigateToInternalLinkType = NavigateToInternalLinkParamsType => void

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const onLinkPress = (url: string,
  navigation: NavigationStackProp<*>,
  language: string,
  navigateToInternalLink: ?NavigateToInternalLinkType) => {
  if (url.includes('.pdf')) {
    navigation.navigate('PDFViewModal', { url })
  } else if (url.includes('.png') || url.includes('.jpg')) {
    navigation.navigate('ImageViewModal', { url })
  } else if (navigateToInternalLink && HIJACK.test(url)) {
    navigateToInternalLink({
      url,
      language
    })
  } else {
    Linking.openURL(url).catch(err => console.error('An error occurred', err))
  }
}

export default onLinkPress
