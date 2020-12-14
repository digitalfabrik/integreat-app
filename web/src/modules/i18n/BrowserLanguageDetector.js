let hasLocalStorageSupport = null

const localStorageAvailable = () => {
  if (hasLocalStorageSupport !== null) {
    return hasLocalStorageSupport
  }

  try {
    hasLocalStorageSupport = window !== 'undefined' && window.localStorage !== null
    const testKey = 'i18next.translate.boo'
    window.localStorage.setItem(testKey, 'foo')
    window.localStorage.removeItem(testKey)
  } catch (e) {
    hasLocalStorageSupport = false
  }
  return hasLocalStorageSupport
}

const LANGUAGE_LOCAL_STORAGE = 'i18nextLng'

export default {
  type: 'languageDetector',
  async: false,
  init: (services, detectorOptions, i18nextOptions) => {},
  // https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/navigator.js
  // Returns array of ISO-639-2 or ISO-639-3 language codes
  detect: () => {
    const bcp47Tags = []

    if (localStorageAvailable()) {
      const localStorageLanguage = window.localStorage.getItem(LANGUAGE_LOCAL_STORAGE)
      if (localStorageLanguage) {
        bcp47Tags.push(localStorageLanguage)
      }
    }

    if (typeof navigator !== 'undefined') {
      if (navigator.languages) { // chrome only; not an array, so can't use .push.apply instead of iterating
        for (let i = 0; i < navigator.languages.length; i++) {
          bcp47Tags.push(navigator.languages[i])
        }
      }
      if (navigator.userLanguage) {
        bcp47Tags.push(navigator.userLanguage)
      }
      if (navigator.language) {
        bcp47Tags.push(navigator.language)
      }
    }

    const iso639Codes = bcp47Tags.map(bcp47Tag => {
      if (bcp47Tag.includes('-')) {
        return bcp47Tag.split('-')[0]
      }
      return bcp47Tag
    })

    return iso639Codes.length > 0 ? iso639Codes : undefined // Returning array: new i18next v19.5.0
  },
  cacheUserLanguage: language => {
    if (localStorageAvailable()) {
      window.localStorage.setItem(LANGUAGE_LOCAL_STORAGE, language)
    }
  }
}
