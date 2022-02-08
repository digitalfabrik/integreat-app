let hasLocalStorageSupport: boolean | null = null

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

const safeLocalStorage = {
  isAvailable,
  setItem,
  getItem
}

export default safeLocalStorage
