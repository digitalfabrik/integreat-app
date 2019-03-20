// @flow

import i18n from 'i18next'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18nextProvider, reactI18nextModule } from 'react-i18next'
import { forEach, reduce } from 'lodash/collection'

import localesResources from 'locales.json'
import setUiDirection from '../actions/setUIDirection'
import type { Dispatch } from 'redux'
import LanguageDetector from '../LanguageDetector'
import type { StoreActionType } from '../../app/StoreActionType'
import type { StateType } from '../../app/StateType'

const RTL_LANGUAGES = ['ar', 'fa']
const FALLBACK_LANGUAGES = ['en', 'de']
const DEFAULT_LANGUAGE = 'en'

type FontMapType = { [font: 'lateef' | 'openSans' | 'raleway']: boolean }

type PropsType = {
  children?: React.Node,
  language: string,
  setUiDirection: Function
}

export class I18nProvider extends React.Component<PropsType, {
  language: string,
  fonts: FontMapType
}> {
  i18n: i18n

  constructor () {
    super()

    const i18nextResources = I18nProvider.transformResources(localesResources)
    this.i18n = i18n
      .createInstance()
      .use(LanguageDetector)
      .use(reactI18nextModule)
      .init({
        resources: i18nextResources,
        fallbackLng: FALLBACK_LANGUAGES,
        load: 'languageOnly',
        debug: __DEV__
      })

    this.state = {language: DEFAULT_LANGUAGE, fonts: I18nProvider.getSelectedFonts(DEFAULT_LANGUAGE)}
  }

  /**
   * Transform locale resources to the structure: languageCode -> namespace -> key:value
   * And not: namespace -> languageCode -> key:value
   * @param {object} resources
   * @returns {object} transformed resources suplliable to i18next instance
   */
  static transformResources (resources: {
    namespace: string,
    language: { langauge: string, languageCode: string }
  }): { key: string, value: string } {
    return reduce(
      resources,
      (accumulator, namespace, namespaceName) => {
        forEach(namespace, (language, languageCode) => {
          accumulator[languageCode] = {
            ...accumulator[languageCode],
            [namespaceName]: language
          }
        })
        return accumulator
      },
      {}
    )
  }

  getPredeterminedLanguage (knownLanguage: string): string {
    if (knownLanguage) {
      return knownLanguage
    } else if (this.i18n.languages && this.i18n.languages.length > 0) {
      return this.i18n.languages[0]
    } else {
      throw new Error('Failed to set language because it is currently unknown and even i18next does not know it!')
    }
  }

  setLanguage (language: string) {
    const targetLanguage = this.getPredeterminedLanguage(language)

    const fonts = I18nProvider.getSelectedFonts(targetLanguage)
    this.setState({language: targetLanguage, fonts})
    this.props.setUiDirection(RTL_LANGUAGES.includes(targetLanguage) ? 'rtl' : 'ltr')

    // Set i18next language to apps language
    this.i18n.changeLanguage(targetLanguage)
  }

  componentDidMount () {
    this.setLanguage(this.props.language)
  }

  componentDidUpdate (prevProps: PropsType) {
    if (this.props.language !== prevProps.language) {
      this.setLanguage(this.props.language)
    }
  }

  static getSelectedFonts (language: string): FontMapType {
    // Lateef for arabic ui and content, Open Sans for latin text in arabic text, Raleway for latin ui
    return {
      lateef: ['ar', 'fa', 'ku'].includes(language),
      openSans: true,
      raleway: true
    }
  }

  render () {
    return (
      <I18nextProvider i18n={this.i18n}>
        <>
          {this.props.children}
        </>
      </I18nextProvider>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  setUiDirection: action => dispatch(setUiDirection(action))
})

const mapStateToProps = (state: StateType) => ({language: state.currentLanguage})

// $FlowFixMe connect()
export default connect(mapStateToProps, mapDispatchToProps)(I18nProvider)
