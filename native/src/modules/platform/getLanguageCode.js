// @flow

import { NativeModules, Platform } from 'react-native'

export default () => {
  const languageCode = Platform.select({
    android: NativeModules?.I18nManager?.localeIdentifier,
    ios: NativeModules?.SettingsManager?.settings?.AppleLocale
  })

  if (!languageCode) {
    throw new Error('Failed to get language code from native side!')
  }

  return languageCode
}
