// @flow

import { values } from './utils/object'

type SupportedLanguagesType = { [languageCode: string]: {| rtl: boolean |} }
type FallbacksType = { [languageCode: string]: string[] }

class Config {
  // The language from which we translate
  sourceLanguage = 'de'

  // The languages into which we translate from 'sourceLanguage' including the sourceLanguage
  supportedLanguages: SupportedLanguagesType = {
    de: { rtl: false },
    ar: { rtl: true },
    en: { rtl: false },
    fa: { rtl: true },
    fr: { rtl: false },
    ro: { rtl: false },
    tr: { rtl: false },
    pl: { rtl: false },
    ti: { rtl: false },
    ku: { rtl: false },
    ru: { rtl: false },
    so: { rtl: false },
    hr: { rtl: false },
    es: { rtl: false },
    sr: { rtl: false },
    ps: { rtl: true },
    kmr: { rtl: true },
    am: { rtl: false },
    bg: { rtl: false },
    el: { rtl: false },
    it: { rtl: false }
  }

  // Fallbacks for unnormalized language codes from our backend
  fallbacks: FallbacksType = {
    ku: ['ku'],
    kmr: ['kmr'],
    ckb: ['ku'],
    'fa-AF': ['fa'],
    fa: ['fa'],
    fa_pr: ['fa'],
    per: ['fa'],
    de: ['de'],
    'de-si': ['de'],
    en: ['en'],
    fr: ['fr'],
    ar: ['ar'],
    ro: ['ro'],
    tr: ['tr'],
    pl: ['pl'],
    ti: ['ti'],
    ru: ['ru'],
    so: ['so'],
    hr: ['hr'],
    es: ['es'],
    sr: ['sr'],
    ps: ['ps']
  }

  defaultFallback = 'de' // If the language code is not found in our translations then use this

  constructor () {
    this.checkConsistency()
  }

  getSupportedLanguageCodes (): string[] {
    return Object.keys(this.supportedLanguages)
  }

  getFallbackLanguageCodes (): string[] {
    const languageCodes = []
    const fallbacks: string[][] = values(this.fallbacks)

    fallbacks.forEach((languagesInFallbacks: string[]) => {
      languagesInFallbacks.forEach((languageCode: string) => {
        languageCodes.push(languageCode)
      })
    })

    return languageCodes
  }

  checkConsistency () {
    const supportedLanguageCodes = this.getSupportedLanguageCodes()

    this.getFallbackLanguageCodes().forEach((languageCode: string) => {
      if (!supportedLanguageCodes.includes(languageCode)) {
        throw Error(`The code ${languageCode} was mentioned in the fallbacks but is not included in 'targetLanguage'`)
      }
    })
  }
}

export default new Config()
