// @flow

import { forEach, reduce } from 'lodash'
import type { TransformedTranslationsType, TranslationsType } from './types'

/**
 * Transform translation resources from our internal translations format to be i18next compatible.
 * @param {object} translations in our format: namespace -> languageTag -> key -> value
 * @returns {object} transformed translations in the format: languageTag -> namespace -> key -> value
 */
export default (translations: TranslationsType): TransformedTranslationsType => reduce(
  translations,
  (transformedTranslations, namespace, namespaceName) => {
    forEach(namespace, (language, languageTag) => {
      transformedTranslations[languageTag] = {
        ...transformedTranslations[languageTag],
        [namespaceName]: language
      }
    })
    return transformedTranslations
  },
  {}
)
