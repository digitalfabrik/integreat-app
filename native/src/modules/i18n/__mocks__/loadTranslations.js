// @flow

import translations from './translations.json'
import transformTranslations from '../transformTranslations'
import type { TransformedTranslationsType } from '../loadTranslations'

const loadTranslations = (): TransformedTranslationsType => {
  return transformTranslations(translations)
}

export default loadTranslations
