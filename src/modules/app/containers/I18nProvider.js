import i18n from 'i18next'
import React from 'react'
import { connect } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { reduce, forEach } from 'lodash/collection'
import WebFont from 'webfontloader'
import PropTypes from 'prop-types'
import LanguageDetector from 'i18next-browser-languagedetector'

import localesResources from '../../../locales.json'

const RTL_LANGUAGES = ['ar', 'fa']
const FALLBACK_LANGUAGE = 'en'

class I18nProvider extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    language: PropTypes.string
  }

  /**
   * Transform locale resources to the structure: languageCode -> namespace -> key:value
   * And not: namespace -> languageCode -> key:value
   */
  transformResources (resources) {
    return reduce(resources, (accumulator, namespace, namespaceName) => {
      forEach(namespace, (language, languageCode) => {
        accumulator[languageCode] = {...accumulator[languageCode], [namespaceName]: language}
      })
      return accumulator
    }, {})
  }

  constructor () {
    super()

    const i18nextResources = this.transformResources(localesResources)
    this._i18n = i18n
      .use(LanguageDetector)
      .init({
        resources: i18nextResources,
        fallbackLng: FALLBACK_LANGUAGE,
        load: 'languageOnly',
        // eslint-disable-next-line no-undef
        debug: __DEV__
      })

    this.state = {language: FALLBACK_LANGUAGE}
  }

  setLanguage (language) {
    const targetLanguage = language || this._i18n.languages[0]
    this.setState({language: targetLanguage})

    document.documentElement.lang = targetLanguage

    // Set i18n language to apps language
    this._i18n.changeLanguage(targetLanguage)
    this.loadFonts(targetLanguage)
  }

  componentWillMount () {
    this.setLanguage(this.props.language)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.language !== this.props.language) {
      this.setLanguage(nextProps.language)
    }
  }

  loadFonts (language) {
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
    return <I18nextProvider i18n={this._i18n}>
      <div style={{'direction': RTL_LANGUAGES.includes(this.state.language) ? 'rtl' : 'ltr'}}>
        {this.props.children}
      </div>
    </I18nextProvider>
  }
}

const mapStateToProps = (state) => ({language: state.router.params.language})

export default connect(mapStateToProps)(I18nProvider)
