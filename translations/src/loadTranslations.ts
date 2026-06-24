import { deepmerge } from 'deepmerge-ts'

import transformTranslations from './transformTranslations.js'
import defaultTranslations from './translations.json' with { type: 'json' }
import { TranslationsType, TransformedTranslationsType } from './types.js'

const loadTranslations = (translationsOverride?: TranslationsType): TransformedTranslationsType => {
  const translations = translationsOverride
    ? deepmerge(defaultTranslations as TranslationsType, translationsOverride)
    : defaultTranslations
  return transformTranslations(translations)
}

export default loadTranslations
