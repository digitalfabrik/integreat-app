// @flow

import { forEach, reduce } from 'lodash'
import type { TransformedTranslationsType } from './loadTranslations'
import type { TranslationsType } from 'build-configs/BuildConfigType'

/**
 * Transform translation resources from our internal translations format to be i18next compatible.
 * @param {object} translations in our format: namespace -> languageCode -> key -> value
 * @returns {object} transformed translations in the format: languageCode -> namespace -> key -> value
 */
export default (translations: TranslationsType): TransformedTranslationsType => reduce(
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
