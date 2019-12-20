// @flow

import { Linking } from 'react-native'

const openPrivacyPolicy = (language: string) => {
  if (language === 'de') {
    Linking.openURL('https://integreat-app.de/datenschutz/')
  } else {
    Linking.openURL('https://integreat-app.de/en/privacy/')
  }
}

export default openPrivacyPolicy
