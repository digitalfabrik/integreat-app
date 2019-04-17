import { NativeModules, Platform } from 'react-native'

export default {
  type: 'languageDetector',
  async: false,
  detect: () => {
    let systemLanguage = 'en'
    if (Platform.OS === 'android') {
      systemLanguage = NativeModules.I18nManager.localeIdentifier
    } else {
      systemLanguage = NativeModules.SettingsManager.settings.AppleLocale
    }

    return systemLanguage.substring(0, 2)
  },
  init: () => {},
  cacheUserLanguage: () => {}
}
