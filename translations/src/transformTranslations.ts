import { TransformedTranslationsType, TranslationsType } from './types'

/**
 * Transform translation resources from our internal translations format to be i18next compatible.
 * @param {object} translations in our format: namespace -> languageTag -> key -> value
 * @returns {object} transformed translations in the format: languageTag -> namespace -> key -> value
 */

export default (translations: TranslationsType): TransformedTranslationsType =>
  Object.entries(translations).reduce(
    (transformedTranslations: TransformedTranslationsType, [namespaceName, namespace]) => {
      const newTransformedTranslations = transformedTranslations
      Object.entries(namespace).forEach(([languageTag, language]) => {
        newTransformedTranslations[languageTag] = {
          ...newTransformedTranslations[languageTag],
          [namespaceName]: language as Record<string, string>,
        }
      })
      return newTransformedTranslations
    },
    {},
  )
