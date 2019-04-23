// @flow

import { NativeModules, Platform } from 'react-native'

/**
 * @returns {string} the system locale in the format "de_DE"
 */
export const getLocale = () => {
  const locale = Platform.select({
    ios: NativeModules?.I18nManager?.localeIdentifier,
    android: NativeModules?.SettingsManager?.settings?.AppleLocale
  })

  if (!locale) {
    throw new Error('Failed to get "locale" from native side!')
  }

  return locale
}
