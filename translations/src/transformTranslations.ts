import { forEach, reduce } from 'lodash'

import { TransformedTranslationsType, TranslationsType } from './types'

/**
 * Transform translation resources from our internal translations format to be i18next compatible.
 * @param {object} translations in our format: namespace -> languageTag -> key -> value
 * @returns {object} transformed translations in the format: languageTag -> namespace -> key -> value
 */

export default (translations: TranslationsType): TransformedTranslationsType =>
  reduce<TranslationsType, TransformedTranslationsType>(
    translations,
    (transformedTranslations, namespace, namespaceName) => {
      const newTransformedTranslations = transformedTranslations
      forEach(namespace, (language, languageTag) => {
        newTransformedTranslations[languageTag] = {
          ...newTransformedTranslations[languageTag],
          [namespaceName]: language as Record<string, string>,
        }
      })
      return newTransformedTranslations
    },
    {}
  )
