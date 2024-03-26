import { LanguageDetectorModule } from 'i18next'

import safeLocalStorage, { I18N_LANGUAGE_KEY } from './safeLocalStorage'

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => undefined,
  // Returns array of ISO-639-2 or ISO-639-3 language codes
  detect: () => {
    const bcp47Tags: string[] = []

    const localStorageLanguage = safeLocalStorage.getItem(I18N_LANGUAGE_KEY)

    if (localStorageLanguage) {
      bcp47Tags.push(localStorageLanguage)
    }

    // Adapted from:
    // https://github.com/i18next/i18next-browser-languageDetector/blob/a84df47faf3603ece04bc224e8e0f6f0ca1df923/src/browserLookups/navigator.js
    if (typeof navigator !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,@typescript-eslint/strict-boolean-expressions
      if (navigator.languages) {
        // chrome only; not an array, so can't use .push.apply instead of iterating
        for (let i = 0; i < navigator.languages.length; i += 1) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    safeLocalStorage.setItem(I18N_LANGUAGE_KEY, language)
  },
}

export default languageDetector
