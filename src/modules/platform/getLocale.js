// @flow

import { NativeModules, Platform } from 'react-native'

/**
 * @returns {string} the system locale in the format "de_DE"
 */
export default () => {
  const locale = Platform.select({
    android: NativeModules?.I18nManager?.localeIdentifier,
    ios: NativeModules?.SettingsManager?.settings?.AppleLocale
  })

  if (!locale) {
    throw new Error('Failed to get "locale" from native side!')
  }

  return locale
}
