// @flow

import i18n from 'i18next'
import * as React from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { forEach, reduce } from 'lodash/collection'

import localesResources from '../../../../locales/locales.json'
import LanguageDetector from '../LanguageDetector'
import MomentContext, { createMomentFormatter } from '../context/MomentContext'
import AppSettings from '../../settings/AppSettings'
import { Text } from 'react-native'

export const RTL_LANGUAGES = ['ar', 'fa']
const FALLBACK_LANGUAGES = ['en', 'de']
export const DEFAULT_LANGUAGE = 'en'

type PropsType = {|
  children?: React.Node,
  setContentLanguage: (language: string) => void
|}

type StateType = {|
  errorMessage: ?string,
  initialisationFinished: boolean
|}

class I18nProvider extends React.Component<PropsType, StateType> {
  i18n: i18n
  appSettings: AppSettings

  constructor () {
    super()

    this.state = { errorMessage: null, initialisationFinished: false }

    const i18nextResources = I18nProvider.transformResources(localesResources)
    this.i18n = i18n
      .createInstance()
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: i18nextResources,
        fallbackLng: FALLBACK_LANGUAGES,
        load: 'languageOnly',
        debug: __DEV__
      })

    this.appSettings = new AppSettings()
  }

  /**
   * Transform locale resources to the structure: languageCode -> namespace -> key:value
   * And not: namespace -> languageCode -> key:value
   * @param {object} resources
   * @returns {object} transformed resources that can be supplied to i18next instance
   */
  static transformResources (resources: {
    [namespace: string]: { [language: string]: { [key: string]: string } }
  }): {
    [language: string]: { [namespace: string]: { [key: string]: string } }
  } {
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

  async initContentLanguage () {
    const { setContentLanguage } = this.props
    const contentLanguage = await this.appSettings.loadContentLanguage()
    const uiLanguage = this.getI18nextLanguage()

    if (!contentLanguage) {
      await this.appSettings.setContentLanguage(uiLanguage)
    }
    setContentLanguage(contentLanguage || uiLanguage)

    this.setState({ initialisationFinished: true })
  }

  componentDidMount () {
    this.initContentLanguage().catch(error => {
      this.setState(() => ({ errorMessage: error.message }))
    })
  }

  momentFormatter = createMomentFormatter(() => undefined, () => DEFAULT_LANGUAGE)

  render () {
    if (this.state.errorMessage) {
      return <Text>{this.state.errorMessage}</Text>
    }

    return (
      <I18nextProvider i18n={this.i18n}>
        <MomentContext.Provider value={this.momentFormatter}>
          {this.state.initialisationFinished ? this.props.children : null}
        </MomentContext.Provider>
      </I18nextProvider>
    )
  }
}

export default I18nProvider
