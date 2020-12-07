// @flow

import { reduce, forEach, merge } from 'lodash'
import defaultTranslations from 'translations/translations.json'
import buildConfig from '../app/constants/buildConfig'
import type { TranslationsType } from 'build-configs/BuildConfigType'

type TransformedTranslationsType = { [language: string]: { [namespace: string]: { [key: string]: string } } }

/**
 * Transform translation resources from our internal translations format to be i18next compatible.
 * @param {object} translations in our format: namespace -> languageCode -> key -> value
 * @returns {object} transformed translations in the format: languageCode -> namespace -> key -> value
 */
const transformTranslations = (translations: TranslationsType): TransformedTranslationsType => reduce(
  translations,
  (transformedTranslations, namespace, namespaceName) => {
    forEach(namespace, (language, languageCode) => {
      transformedTranslations[languageCode] = {
        ...transformedTranslations[languageCode],
        [namespaceName]: language
      }
    })
    return transformedTranslations
  },
  {}
)

const loadTranslations = (): TransformedTranslationsType => {
  const translationsOverride = buildConfig().translationsOverride
  // If keys are missing in 'defaultTranslations', merge does not include those
  // https://lodash.com/docs/4.17.15#merge
  const translations = translationsOverride ? merge(defaultTranslations, translationsOverride) : defaultTranslations
  return transformTranslations(translations)
}

export default loadTranslations
