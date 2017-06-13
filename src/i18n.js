import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resources from '../locales/'

i18n
  .use(LanguageDetector)
  .init({
    resources: resources,
    fallbackLng: 'en',
    ns: ['common', 'Location'],
    defaultNS: 'common',
    load: 'languageOnly',
    debug: true
  })

export default i18n
