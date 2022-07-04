let hasLocalStorageSupport: boolean | null = null

export const I18N_LANGUAGE_KEY = 'i18nextLng'
export const PAGE_FORCE_REFRESHED_KEY = 'pageForceRefreshed'
export const JPAL_TRACKING_CODE_KEY = 'jpalTrackingCode'
export const API_URL_KEY = 'api-url'

// Adapted from:
// https://github.com/i18next/i18next-browser-languageDetector/blob/90284ca924353de0e6991bc51a0453f90fac3a04/src/browserLookups/localStorage.js
const isAvailable = (): boolean => {
  if (hasLocalStorageSupport !== null) {
    return hasLocalStorageSupport
  }

  try {
    const localStorage = window.localStorage
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    hasLocalStorageSupport = localStorage !== null
    const testKey = 'i18next.translate.boo'
    localStorage.setItem(testKey, 'foo')
    localStorage.removeItem(testKey)
  } catch (e) {
    hasLocalStorageSupport = false
  }

  return hasLocalStorageSupport
}

const getItem = (key: string): string | null => {
  if (isAvailable()) {
    return window.localStorage.getItem(key)
  }
  return null
}

const setItem = (key: string, value: string): void => {
  if (isAvailable()) {
    window.localStorage.setItem(key, value)
  }
}

const removeItem = (key: string): void => {
  if (isAvailable()) {
    window.localStorage.removeItem(key)
  }
}

const safeLocalStorage = {
  isAvailable,
  setItem,
  getItem,
  removeItem
}

export default safeLocalStorage
