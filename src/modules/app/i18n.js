import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import localesResources from '../../locales'
import { reduce, forEach } from 'lodash/collection'

const FALLBACK_LANGUAGE = 'en'

/**
 * Transform locale resources to the structure: languageCode -> namespace -> key:value
 * And not: namespace -> languageCode -> key:value
 * @param {object} resources
 * @returns {object} transformed resources suplliable to i18next instance
 */
function transformResources (resources) {
  return reduce(resources, (accumulator, namespace, namespaceName) => {
    forEach(namespace, (language, languageCode) => {
      accumulator[languageCode] = {...accumulator[languageCode], [namespaceName]: language}
    })
    return accumulator
  }, {})
}

i18n
  .use(LanguageDetector)
  .init({
    resources: transformResources(localesResources),
    fallbackLng: FALLBACK_LANGUAGE,
    load: 'languageOnly',
    // eslint-disable-next-line no-undef
    debug: __DEV__
  })

export default i18n
