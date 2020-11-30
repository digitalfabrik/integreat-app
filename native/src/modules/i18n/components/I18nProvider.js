// @flow

import i18n from 'i18next'
import * as React from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import loadLocales from '../loadLocales'
import LanguageDetector from '../LanguageDetector'
import MomentContext, { createMomentFormatter } from '../context/MomentContext'
import AppSettings from '../../settings/AppSettings'
import { Text } from 'react-native'
import buildConfig from '../../app/constants/buildConfig'

export const DEFAULT_LANGUAGE = 'de'
const FALLBACK_LANGUAGES = [DEFAULT_LANGUAGE]

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

  constructor (props: PropsType) {
    super(props)

    this.state = { errorMessage: null, initialisationFinished: false }

    this.i18n = i18n.createInstance()
    this.appSettings = new AppSettings()
  }

  getI18nextLanguage = (): string => {
    if (this.i18n.languages && this.i18n.languages.length > 0) {
      return this.i18n.languages[0]
    } else {
      throw new Error('Failed to set language because it is currently unknown and even i18next does not know it!')
    }
  }

  initI18n = async () => {
    try {
      const i18nextResources = loadLocales()
      await this.i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          resources: i18nextResources,
          fallbackLng: FALLBACK_LANGUAGES,
          load: 'languageOnly',
          debug: buildConfig().featureFlags.developerFriendly
        })

      await this.initContentLanguage()

      this.setState({ initialisationFinished: true })
    } catch (e) {
      this.setState({ errorMessage: e.message })
    }
  }

  initContentLanguage = async () => {
    const { setContentLanguage } = this.props
    const contentLanguage = await this.appSettings.loadContentLanguage()
    const uiLanguage = this.getI18nextLanguage()

    if (!contentLanguage) {
      await this.appSettings.setContentLanguage(uiLanguage)
    }
    setContentLanguage(contentLanguage || uiLanguage)
  }

  componentDidMount () {
    this.initI18n()
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
