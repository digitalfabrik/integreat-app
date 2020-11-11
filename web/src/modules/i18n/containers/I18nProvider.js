// @flow

import i18next from 'i18next'
import * as React from 'react'
import { connect } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { Helmet as ReactHelmet } from 'react-helmet'
import LanguageDetector from 'i18next-browser-languagedetector'
import setUiDirection from '../actions/setUIDirection'
import type { Dispatch } from 'redux'
import type { StoreActionType } from '../../app/StoreActionType'
import type { UiDirectionType } from '../types/UiDirectionType'
import loadLocales from '../loadLocales'
import buildConfig from '../../app/constants/buildConfig'

const RTL_LANGUAGES = ['ar', 'fa']
const FALLBACK_LANGUAGES = ['en', 'de']
const DEFAULT_LANGUAGE = 'en'

type FontMapType = { [font: 'lateef' | 'openSans' | 'raleway']: boolean }

type PropsType = {|
  children: React.Node,
  language?: string,
  setUiDirection: (UiDirectionType) => void
|}

type StateType = {|
  language: string,
  fonts: FontMapType,
  i18nLoaded: boolean
|}

export class I18nProvider extends React.Component<PropsType, StateType> {
  i18n: i18next.i18n

  constructor () {
    super()

    const i18nextResources = loadLocales()
    this.i18n = i18next.createInstance()
      .use(LanguageDetector)
    this.i18n.init({
      resources: i18nextResources,
      fallbackLng: FALLBACK_LANGUAGES,
      load: 'languageOnly',
      interpolation: {
        escapeValue: false // Escaping is not needed for react apps: https://github.com/i18next/react-i18next/issues/277
      },
      debug: buildConfig().development
    })
    this.state = {
      language: DEFAULT_LANGUAGE,
      fonts: I18nProvider.getSelectedFonts(DEFAULT_LANGUAGE),
      i18nLoaded: true
    }
  }

  componentDidMount () {
    this.setLanguage(this.props.language)
  }

  setLanguage (language: ?string) {
    const targetLanguage = language || this.i18n.languages[0]

    // Set i18next language to apps language
    this.i18n.changeLanguage(targetLanguage, () => {
      const fonts = I18nProvider.getSelectedFonts(targetLanguage)
      this.setState(prevState => ({ ...prevState, language: targetLanguage, fonts }))

      this.props.setUiDirection(RTL_LANGUAGES.includes(targetLanguage) ? 'rtl' : 'ltr')
      if (document.documentElement) {
        document.documentElement.lang = targetLanguage
      }
    })
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
    const { language, fonts: { lateef, openSans, raleway } } = this.state
    return (
      <I18nextProvider i18n={this.i18n}>
        <div
          style={{
            direction: RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'
          }}>
          <ReactHelmet>
            {lateef && <link href='/fonts/lateef/lateef.css' rel='stylesheet' />}
            {openSans && <link href='/fonts/open-sans/open-sans.css' rel='stylesheet' />}
            {raleway && <link href='/fonts/raleway/raleway.css' rel='stylesheet' />}
          </ReactHelmet>
          {this.props.children}
        </div>
      </I18nextProvider>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({
  setUiDirection: action => dispatch(setUiDirection(action))
})

const mapStateToProps = state => ({ language: state.location.payload.language })

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(I18nProvider)
