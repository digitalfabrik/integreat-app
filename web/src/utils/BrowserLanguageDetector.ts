import { LanguageDetectorModule } from 'i18next'

import safeLocalStorage from './safeLocalStorage'

const LANGUAGE_LOCAL_STORAGE = 'i18nextLng'
const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => undefined,
  // Returns array of ISO-639-2 or ISO-639-3 language codes
  detect: () => {
    const bcp47Tags: string[] = []

    const localStorageLanguage = safeLocalStorage.getItem(LANGUAGE_LOCAL_STORAGE)

    if (localStorageLanguage) {
      bcp47Tags.push(localStorageLanguage)
    }

    // Adapted from:
    // https://github.com/i18next/i18next-browser-languageDetector/blob/a84df47faf3603ece04bc224e8e0f6f0ca1df923/src/browserLookups/navigator.js
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof navigator !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.languages) {
        // chrome only; not an array, so can't use .push.apply instead of iterating
        for (let i = 0; i < navigator.languages.length; i += 1) {
          bcp47Tags.push(navigator.languages[i]!)
        }
      }

      // IE only
      const userLanguage = (navigator as { userLanguage?: string }).userLanguage
      if (userLanguage) {
        bcp47Tags.push(userLanguage)
      }

      if (navigator.language) {
        bcp47Tags.push(navigator.language)
      }
    }

    return bcp47Tags.length > 0 ? bcp47Tags : undefined
  },
  cacheUserLanguage: (language: string) => {
    safeLocalStorage.setItem(LANGUAGE_LOCAL_STORAGE, language)
  }
}

export default languageDetector
