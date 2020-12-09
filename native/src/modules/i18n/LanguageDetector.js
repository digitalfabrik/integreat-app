// @flow

import getLanguageCode from '../platform/getLanguageCode'

export default {
  type: 'languageDetector',
  async: false,
  detect: () => {
    const languageCode = getLanguageCode()

    if (languageCode.length < 2) {
      throw Error('languageCode has wrong format')
    }

    return languageCode.substring(0, 2)
  },
  init: () => {},
  cacheUserLanguage: (newLanguage: string) => {}
}
