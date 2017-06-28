import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resources from '../locales/'
import { setLanguage } from './actions'
import store from './store'

const RTL_LANGUAGES = ['ar', 'fa']

i18n
  .use(LanguageDetector)
  .init({
    resources: resources,
    fallbackLng: 'en',
    ns: ['common', 'errors', 'Location'],
    defaultNS: 'common',
    load: 'languageOnly',
    // eslint-disable-next-line no-undef
    debug: __DEV__
  })

// Set app language to primary language of i18next
store.dispatch(setLanguage(i18n.languages[0]))

function handleLanguageChange () {
  let state = store.getState()
  let lang = state.language.language
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

export default i18n
