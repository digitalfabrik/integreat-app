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

export default {
  type: 'languageDetector',
  async: false,
  init: (services, detectorOptions, i18nextOptions) => {},
  // https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/browserLookups/navigator.js
  detect: () => {
    const found = []

    if (localStorageAvailable()) {
      const localStorageLanguage = window.localStorage.getItem('i18nextLng')
      if (localStorageLanguage) {
        found.push(localStorageLanguage)
      }
    }

    if (typeof navigator !== 'undefined') {
      if (navigator.languages) { // chrome only; not an array, so can't use .push.apply instead of iterating
        for (let i = 0; i < navigator.languages.length; i++) {
          found.push(navigator.languages[i])
        }
      }
      if (navigator.userLanguage) {
        found.push(navigator.userLanguage)
      }
      if (navigator.language) {
        found.push(navigator.language)
      }
    }

    return found.length > 0 ? found : undefined // Returning array: new i18next v19.5.0
  },
  cacheUserLanguage: function (lng) {
    if (localStorageAvailable()) {
      window.localStorage.setItem('i18nextLng', lng)
    }
  }
}
