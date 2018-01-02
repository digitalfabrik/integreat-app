import i18n from 'i18next'
import React from 'react'
import { connect } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { reduce, forEach } from 'lodash/collection'
import WebFont from 'webfontloader'
import PropTypes from 'prop-types'
import LanguageDetector from 'i18next-browser-languagedetector'

import resources from '../../../locales.json'

const RTL_LANGUAGES = ['ar', 'fa']

class I18nProvider extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    language: PropTypes.string
  }

  constructor () {
    super()

    // Transform locale resources to the structure: languageCode -> namespace -> key:value
    // And not: namespace -> languageCode -> key:value
    const i18nextResources = reduce(resources, (accumulator, namespace, namespaceName) => {
      forEach(namespace, (language, languageCode) => {
        accumulator[languageCode] = {...accumulator[languageCode], [namespaceName]: language}
      })
      return accumulator
    }, {})

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
  }

  // Set app language to primary language of i18next
  // store.dispatch(setLanguage(i18n.languages[0])) // fixme
  static handleLanguageChange (language) {
    const lang = language || i18n.languages[0]
    /* Use language from browser detection if it is not available in url
                                         todo: redirect to correct url */

    // Handle ltr/rtl
    document.body.style.direction = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr'

    // Set i18n language to apps language
    i18n.changeLanguage(lang)
    I18nProvider.loadFonts(lang)
  }

  componentWillMount () {
    I18nProvider.handleLanguageChange(this.props.language)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.language !== this.props.language) {
      I18nProvider.handleLanguageChange(nextProps.language)
    }
  }

  static loadFonts (language) {
    // Lateef for arabic ui and content, Open Sans for latin text in arabic text, Raleway for latin ui
    const arabicFonts = ['Lateef:400', 'Raleway:300,400,400i,600,700,700i', 'Open+Sans:400']
    // We do not need an arabic font
    const latinFonts = ['Raleway:300,400,400i,600,700,700i', 'Open+Sans:400']
    const families = {
      ar: arabicFonts,
      fa: arabicFonts,
      ku: arabicFonts
    }

    WebFont.load({google: {families: families[language] || latinFonts}})
  }

  render () {
    return <I18nextProvider i18n={i18n}>
      {this.props.children}
    </I18nextProvider>
  }
}

const mapStateToProps = (state) => ({language: state.router.params.language})

export default connect(mapStateToProps)(I18nProvider)
