import { deepmerge } from 'deepmerge-ts'

import defaultTranslations from '../translations.json'
import transformTranslations from './transformTranslations'
import { TranslationsType, TransformedTranslationsType } from './types'

const loadTranslations = (translationsOverride?: TranslationsType): TransformedTranslationsType => {
  // @ts-expect-error we are ge
  const translations = translationsOverride ? deepmerge(defaultTranslations, translationsOverride) : defaultTranslations
  return transformTranslations(translations)
}

export default loadTranslations
