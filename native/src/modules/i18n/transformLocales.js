// @flow

import { forEach, reduce } from 'lodash'
import type { TransformedLocalesType } from './loadLocales'
import type { LocalesType } from 'build-configs/BuildConfigType'

/**
 * Transform locale resources from our internal locales format to be i18next compatible.
 * @param {object} locales in our format: namespace -> languageCode -> key -> value
 * @returns {object} transformed locales in the format: languageCode -> namespace -> key -> value
 */
export default (locales: LocalesType): TransformedLocalesType => reduce(
  locales,
  (transformedLocales, namespace, namespaceName) => {
    forEach(namespace, (language, languageCode) => {
      transformedLocales[languageCode] = {
        ...transformedLocales[languageCode],
        [namespaceName]: language
      }
    })
    return transformedLocales
  },
  {}
)
