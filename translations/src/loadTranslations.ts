import { deepmerge } from 'deepmerge-ts'

import transformTranslations from './transformTranslations.ts'
import defaultTranslations from './translations.json' with { type: 'json' }
import type { TranslationsType, TransformedTranslationsType } from './types.ts'

const loadTranslations = (translationsOverride?: TranslationsType): TransformedTranslationsType => {
  const translations = translationsOverride
    ? deepmerge(defaultTranslations as TranslationsType, translationsOverride)
    : defaultTranslations
  return transformTranslations(translations)
}

export default loadTranslations
