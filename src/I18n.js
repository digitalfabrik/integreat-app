import i18n from 'i18next'
import { reduce, forEach } from 'lodash/collection'
import WebFont from 'webfontloader'
import LanguageDetector from 'i18next-browser-languagedetector'

import resources from './locales'

class I18n {
  init (store) {
    // Transfrom locale resources so the structure is: languageCode -> namespace -> key:value
    // And not: : namespace -> languageCode -> key:value
    const i18nextResources = reduce(resources, (accumulator, namespace, namespaceName) => {
      forEach(namespace, (language, languageCode) => {
        accumulator[languageCode] = {...accumulator[languageCode], [namespaceName]: language}
      })

      return accumulator
    }, {})

    const RTL_LANGUAGES = ['ar', 'fa']

    i18n
      .use(LanguageDetector)
      .init({
        resources: i18nextResources,
        fallbackLng: 'en',
        ns: ['common', 'errors', 'Location', 'Search', 'Footer'],
        defaultNS: 'common',
        load: 'languageOnly',
        // eslint-disable-next-line no-undef
        debug: __DEV__
      })

    // Set app language to primary language of i18next
    // store.dispatch(setLanguage(i18n.languages[0])) // fixme
    const handleLanguageChange = () => {
      const state = store.getState()

      let lang = i18n.languages[0]  // Use language from browser detection if it is not available in url
                                    // todo: redirect to correct url

      if (state.router.params) {
        lang = state.router.params.language
      }

      // Handle ltr/rtl
      if (RTL_LANGUAGES.includes(lang)) {
        document.body.style.direction = 'rtl'
      } else {
        document.body.style.direction = 'ltr'
      }
      // Set i18n language to apps language
      i18n.changeLanguage(lang)
    }

    store.subscribe(handleLanguageChange)

    const loadFonts = () => {
      const state = store.getState()
      const language = state.router.params.language || 'de'

      const arabicFonts = ['Lateef:400']
      const latinFonts = ['Raleway:300,400,400i,600,700,700i', 'Open+Sans:400']
      const families = {
        de: latinFonts,
        ar: arabicFonts,
        fa: arabicFonts,
        ku: arabicFonts,
        ti: ['El Messiri:300,400,700']
      }

      WebFont.load({
        google: {
          families: families[language] || latinFonts
        }
      })
    }

    loadFonts()

    store.subscribe(loadFonts)
  }

  /**
   * @returns Gets reactnext i18n
   */
  get i18next () {
    return i18n
  }
}

export default I18n
