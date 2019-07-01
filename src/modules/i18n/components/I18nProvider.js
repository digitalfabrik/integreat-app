// @flow

import i18n from 'i18next'
import * as React from 'react'
import { I18nextProvider, reactI18nextModule } from 'react-i18next'
import { forEach, reduce } from 'lodash/collection'

import localesResources from '../../../locales.json'
import LanguageDetector from '../LanguageDetector'
import MomentContext, { createMomentFormatter } from '../context/MomentContext'
import type { UiDirectionType } from '../actions/setUIDirection'

const RTL_LANGUAGES = ['ar', 'fa']
const FALLBACK_LANGUAGES = ['en', 'de']
const DEFAULT_LANGUAGE = 'en'

type PropsType = {|
  children?: React.Node,
  setUiDirection: (direction: UiDirectionType) => void
|}

type StateType = {| language: string |}

class I18nProvider extends React.Component<PropsType, StateType> {
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

    this.state = {language: DEFAULT_LANGUAGE}
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

  getI18nextLanguage (): string {
    if (this.i18n.languages && this.i18n.languages.length > 0) {
      return this.i18n.languages[0]
    } else {
      throw new Error('Failed to set language because it is currently unknown and even i18next does not know it!')
    }
  }

  initLanguage () {
    const targetLanguage = this.getI18nextLanguage()

    this.setState({language: targetLanguage})
    this.props.setUiDirection(RTL_LANGUAGES.includes(targetLanguage) ? 'rtl' : 'ltr')
  }

  componentDidMount () {
    this.initLanguage()
  }

  momentFormatter = createMomentFormatter(() => undefined, () => this.state.language)

  render () {
    return (
      <I18nextProvider i18n={this.i18n}>
        <MomentContext.Provider value={this.momentFormatter}>
            {this.props.children}
        </MomentContext.Provider>
      </I18nextProvider>
    )
  }
}

export default I18nProvider
