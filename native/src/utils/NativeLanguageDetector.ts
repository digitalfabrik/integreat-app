import { LanguageDetectorModule } from 'i18next'
import { getLocales } from 'react-native-localize'

import { config } from 'translations'

const NativeLanguageDetector: LanguageDetectorModule = {
  type: 'languageDetector' as const,
  // Returns ISO-639-2 or ISO-639-3 language tag
  detect: (): string => {
    const locales = getLocales()

    if (locales.length === 0) {
      throw new Error('Failed to get language code from native side!')
    }
    // All languageTags and codes of the users locales that are supported in the app
    // languageTags should be checked first as they contain more information
    // e.g. the normal fallback of `fa` is `pes` (iranian farsi), but the fallback for `fa-AF` is `prs` (Afghan persian/Dari)
    const supportedKeys = locales.reduce((acc, locale) => {
      acc.push(
        config.getLanguageTagIfSupported(locale.languageTag),
        config.getLanguageTagIfSupported(locale.languageCode)
      )
      return acc
    }, [] as Array<string | undefined>)
    // Return the first supported languageTag or our fallback
    return supportedKeys.find(it => it !== undefined) ?? config.defaultFallback
  },
  init: (): void => undefined,
  cacheUserLanguage: (): void => undefined,
}

export default NativeLanguageDetector
