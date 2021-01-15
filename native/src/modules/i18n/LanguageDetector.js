// @flow

import { getLocales } from 'react-native-localize'

export default {
  type: 'languageDetector',
  async: false,
  detect: () => {
    const locales = getLocales()

    if (locales.length === 0) {
      throw new Error('Failed to get language code from native side!')
    }

    return locales[0].languageCode
  },
  init: () => {},
  cacheUserLanguage: (newLanguage: string) => {}
}
