// @flow

import { merge } from 'lodash'
import defaultTranslations from 'translations/translations.json'
import buildConfig from '../app/constants/buildConfig'
import transformTranslations from './transformTranslations'

export type TransformedTranslationsType = { [language: string]: { [namespace: string]: { [key: string]: string } } }

const loadTranslations = (): TransformedTranslationsType => {
  const translationsOverride = buildConfig().translationsOverride
  // // If keys are missing in 'defaultTranslations', merge does not include those
  // // https://lodash.com/docs/4.17.15#merge
  const translations = translationsOverride ? merge(defaultTranslations, translationsOverride) : defaultTranslations
  return transformTranslations(translations)
}

export default loadTranslations
