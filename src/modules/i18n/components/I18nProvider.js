// @flow

import i18n from 'i18next'
import * as React from 'react'
import { I18nextProvider, reactI18nextModule } from 'react-i18next'
import { forEach, reduce } from 'lodash/collection'

import localesResources from '../../../locales.json'
import createLanguageDetector from '../createLanguageDetector'
import MomentContext, { createMomentFormatter } from '../context/MomentContext'
import AppSettings from '../../settings/AppSettings'
import getLocale from '../../platform/constants/getLocale'
import type { AppSettingsType } from '../../settings/AppSettings'

export const RTL_LANGUAGES = ['ar', 'fa']
const FALLBACK_LANGUAGES = ['en', 'de']
export const DEFAULT_LANGUAGE = 'en'

type PropsType = {|
  children?: React.Node,
  setContentLanguage: (language: string) => void,
  getLocale: () => string,
  appSettings: AppSettingsType
|}

class I18nProvider extends React.Component<PropsType> {
  i18n: i18n
  appSettings: AppSettings

  static defaultProps = {
    getLocale: getLocale,
    appSettings: new AppSettings()
  }

  constructor (props: PropsType) {
    super(props)

    const i18nextResources = I18nProvider.transformResources(localesResources)
    this.i18n = i18n
      .createInstance()
      .use(createLanguageDetector(props.getLocale))
      .use(reactI18nextModule)
      .init({
        resources: i18nextResources,
        fallbackLng: FALLBACK_LANGUAGES,
        load: 'languageOnly',
        debug: __DEV__
      })
  }

  /**
   * Transform locale resources to the structure: languageCode -> namespace -> key:value
   * And not: namespace -> languageCode -> key:value
   * @param {object} resources
   * @returns {object} transformed resources that can be supplied to i18next instance
   */
  static transformResources (resources: {
    [namespace: string]: { [language: string]: { [key: string]: string } }
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

  async initContentLanguage () {
    const { setContentLanguage, appSettings } = this.props
    const contentLanguage: ?string = await appSettings.loadContentLanguage()
    const uiLanguage = this.getI18nextLanguage()

    if (!contentLanguage) {
      await appSettings.setContentLanguage(uiLanguage)
      setContentLanguage(uiLanguage)
    }
  }

  componentDidMount () {
    this.initContentLanguage()
  }

  momentFormatter = createMomentFormatter(() => undefined, () => DEFAULT_LANGUAGE)

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
