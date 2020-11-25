// @flow

import { Linking } from 'react-native'
import buildConfig from '../../modules/app/constants/buildConfig'

const openPrivacyPolicy = (language: string) => {
  const privacyUrl = buildConfig().privacyUrls[language] || buildConfig().privacyUrls.default
  Linking.openURL(privacyUrl)
}

export default openPrivacyPolicy
