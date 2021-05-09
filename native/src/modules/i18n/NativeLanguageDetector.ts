import { getLocales } from 'react-native-localize'
export default {
  type: 'languageDetector',
  async: false,
  // Returns array of ISO-639-2 or ISO-639-3 language codes
  detect: () => {
    const locales = getLocales()

    if (locales.length === 0) {
      throw new Error('Failed to get language code from native side!')
    }

    return locales.map(locale => locale.languageTag)
  },
  init: () => {},
  cacheUserLanguage: (newLanguage: string) => {}
}
