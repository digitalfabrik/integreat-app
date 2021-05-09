let hasLocalStorageSupport = null;

// Adapted from:
// https://github.com/i18next/i18next-browser-languageDetector/blob/90284ca924353de0e6991bc51a0453f90fac3a04/src/browserLookups/localStorage.js
const localStorageAvailable = () => {
  if (hasLocalStorageSupport !== null) {
    return hasLocalStorageSupport;
  }

  try {
    const localStorage = window.localStorage;
    hasLocalStorageSupport = window !== 'undefined' && localStorage !== null;
    const testKey = 'i18next.translate.boo';
    localStorage.setItem(testKey, 'foo');
    localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }

  return hasLocalStorageSupport;
};

const LANGUAGE_LOCAL_STORAGE = 'i18nextLng';
export default {
  type: 'languageDetector',
  async: false,
  init: (services, detectorOptions, i18nextOptions) => {},
  // Returns array of ISO-639-2 or ISO-639-3 language codes
  detect: () => {
    const bcp47Tags = [];

    if (localStorageAvailable()) {
      const localStorageLanguage = window.localStorage.getItem(LANGUAGE_LOCAL_STORAGE);

      if (localStorageLanguage) {
        bcp47Tags.push(localStorageLanguage);
      }
    }

    // Adapted from:
    // https://github.com/i18next/i18next-browser-languageDetector/blob/a84df47faf3603ece04bc224e8e0f6f0ca1df923/src/browserLookups/navigator.js
    if (typeof navigator !== 'undefined') {
      if (navigator.languages) {
        // chrome only; not an array, so can't use .push.apply instead of iterating
        for (let i = 0; i < navigator.languages.length; i++) {
          bcp47Tags.push(navigator.languages[i]);
        }
      }

      if (navigator.userLanguage) {
        bcp47Tags.push(navigator.userLanguage);
      }

      if (navigator.language) {
        bcp47Tags.push(navigator.language);
      }
    }

    return bcp47Tags.length > 0 ? bcp47Tags : undefined;
  },
  cacheUserLanguage: language => {
    if (localStorageAvailable()) {
      window.localStorage.setItem(LANGUAGE_LOCAL_STORAGE, language);
    }
  }
};