// @flow

import { reduce, forEach, merge } from 'lodash'
import defaultLocales from '../../../locales/locales.json'
import buildConfig from '../app/constants/buildConfig'
import type { LocalesType } from '../../../build-configs/configs/BuildConfigType'

type TransformedLocalesType = { [language: string]: { [namespace: string]: { [key: string]: string } } }

/**
 * Transform locale resources from our internal locales format to be i18next compatible.
 * @param {object} locales in our format: namespace -> languageCode -> key -> value
 * @returns {object} transformed locales in the format: languageCode -> namespace -> key -> value
 */
const transformLocales = (locales: LocalesType): TransformedLocalesType => reduce(
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

const loadLocales = (): TransformedLocalesType => {
  const localesOverride = buildConfig().localesOverride
  const locales = localesOverride ? merge(defaultLocales, localesOverride) : defaultLocales
  return transformLocales(locales)
}

export default loadLocales
