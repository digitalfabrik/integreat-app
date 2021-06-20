import { getLocales } from 'react-native-localize'

export default {
  type: 'languageDetector' as const,
  async: false,
  // Returns array of ISO-639-2 or ISO-639-3 language codes
  detect: (): string[] => {
    const locales = getLocales()

    if (locales.length === 0) {
      throw new Error('Failed to get language code from native side!')
    }

    return locales.map(locale => locale.languageTag)
  },
  init: (): void => {},
  cacheUserLanguage: (newLanguage: string): void => {
    console.log('Skipping caching of new language ', newLanguage)
  }
}
