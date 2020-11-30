// @flow

import { getLocales } from 'react-native-localize'

/**
 * @returns {string} the system language code usually 2 letter but could be threee letter
 */
export default () => {
  const locales = getLocales()

  if (locales.length === 0) {
    throw new Error('Failed to get language code from native side!')
  }

  return locales[0].languageCode
}
