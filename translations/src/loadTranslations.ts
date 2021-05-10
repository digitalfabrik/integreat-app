import { merge } from 'lodash'
import defaultTranslations from '../translations.json'
import transformTranslations from './transformTranslations'
import { TranslationsType, TransformedTranslationsType } from './types'

const loadTranslations = (translationsOverride?: TranslationsType): TransformedTranslationsType => {
  // // If keys are missing in 'defaultTranslations', merge does not include those
  // // https://lodash.com/docs/4.17.15#merge
  const translations = translationsOverride ? merge(defaultTranslations, translationsOverride) : defaultTranslations
  return transformTranslations(translations)
}

export default loadTranslations
