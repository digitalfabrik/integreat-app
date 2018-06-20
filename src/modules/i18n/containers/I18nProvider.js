import i18n from 'i18next'
import React from 'react'
import { connect } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { reduce, forEach } from 'lodash/collection'
import ReactHelmet from 'react-helmet'
import PropTypes from 'prop-types'
import LanguageDetector from 'i18next-browser-languagedetector'

import localesResources from 'locales.json'
import setUiDirection from '../actions/setUIDirection'

const RTL_LANGUAGES = ['ar', 'fa']
const FALLBACK_LANGUAGE = 'en'

export class I18nProvider extends React.Component {
  i18n

  static propTypes = {
    children: PropTypes.element.isRequired,
    language: PropTypes.string,
    setUiDirection: PropTypes.func
  }

  constructor () {
    super()

    const i18nextResources = I18nProvider.transformResources(localesResources)
    this.i18n = i18n.createInstance()
      .use(LanguageDetector)
      .init({
        resources: i18nextResources,
        fallbackLng: FALLBACK_LANGUAGE,
        load: 'languageOnly',
        // eslint-disable-next-line no-undef
        debug: __DEV__
      })

    this.state = {language: FALLBACK_LANGUAGE, fonts: I18nProvider.getSelectedFonts(FALLBACK_LANGUAGE)}
  }

  /**
   * Transform locale resources to the structure: languageCode -> namespace -> key:value
   * And not: namespace -> languageCode -> key:value
   * @param {object} resources
   * @returns {object} transformed resources suplliable to i18next instance
   */
  static transformResources (resources) {
    return reduce(resources, (accumulator, namespace, namespaceName) => {
      forEach(namespace, (language, languageCode) => {
        accumulator[languageCode] = {...accumulator[languageCode], [namespaceName]: language}
      })
      return accumulator
    }, {})
  }

  setLanguage (language) {
    const targetLanguage = language || this.i18n.languages[0]

    const fonts = I18nProvider.getSelectedFonts(targetLanguage)
    this.setState({language: targetLanguage, fonts})
    this.props.setUiDirection(RTL_LANGUAGES.includes(targetLanguage) ? 'rtl' : 'ltr')
    document.documentElement.lang = targetLanguage

    // Set i18next language to apps language
    this.i18n.changeLanguage(targetLanguage)
  }

  componentWillMount () {
    this.setLanguage(this.props.language)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.language !== this.props.language) {
      this.setLanguage(nextProps.language)
    }
  }

  static getSelectedFonts (language) {
    // Lateef for arabic ui and content, Open Sans for latin text in arabic text, Raleway for latin ui
    return {
      lateef: ['ar', 'fa', 'ku'].includes(language),
      openSans: true,
      raleway: true
    }
  }

  render () {
    const {lateef, openSans, raleway} = this.state.fonts
    return <I18nextProvider i18n={this.i18n}>
      <div style={{'direction': RTL_LANGUAGES.includes(this.state.language) ? 'rtl' : 'ltr'}}>
        <ReactHelmet>
          {lateef && <link href='/fonts/lateef/lateef.css' rel='stylesheet' />}
          {openSans && <link href='/fonts/open-sans/open-sans.css' rel='stylesheet' />}
          {raleway && <link href='/fonts/raleway/raleway.css' rel='stylesheet' />}
        </ReactHelmet>
        {this.props.children}
      </div>
    </I18nextProvider>
  }
}

const mapDispatchToProps = dispatch => ({setUiDirection: action => dispatch(setUiDirection(action))})

const mapStateToProps = state => ({language: state.location.payload.language})

export default connect(mapStateToProps, mapDispatchToProps)(I18nProvider)
