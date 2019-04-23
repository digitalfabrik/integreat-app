import { getLocale } from '../platform/constants/locale'

export default {
  type: 'languageDetector',
  async: false,
  detect: () => {
    const locale = getLocale()

    if (locale.length < 2) {
      throw Error('locale has wrong format')
    }

    return locale.substring(0, 2)
  },
  init: () => {},
  cacheUserLanguage: () => {
    throw Error('It is not possible to change the user language')
  }
}
