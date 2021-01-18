// @flow

import { entries, values } from './utils/object'

type FontType = 'lateef' | 'openSans' | 'raleway'
type SupportedLanguagesType = { [languageCode: string]: {| rtl: boolean, additionalFont?: FontType |} }
type FallbacksType = { [languageCode: string]: string[] }

class Config {
  // The language from which we translate
  sourceLanguage = 'de'

  // The languages into which we translate from 'sourceLanguage' including the sourceLanguage
  supportedLanguages: SupportedLanguagesType = {
    de: { rtl: false },
    ar: {
      // Lateef for arabic ui and content, Open Sans for latin text in arabic text, Raleway for latin ui
      rtl: true,
      additionalFont: 'lateef'
    },
    en: { rtl: false },
    fa: {
      rtl: true,
      additionalFont: 'lateef'
    },
    fr: { rtl: false },
    ro: { rtl: false },
    tr: { rtl: false },
    pl: { rtl: false },
    ti: { rtl: false },
    ku: {
      rtl: false,
      additionalFont: 'lateef'
    },
    ru: { rtl: false },
    so: { rtl: false },
    hr: { rtl: false },
    es: { rtl: false },
    sr: { rtl: false },
    ps: { rtl: true },
    kmr: {
      rtl: true,
      additionalFont: 'lateef'
    },
    am: { rtl: false },
    bg: { rtl: false },
    el: { rtl: false },
    it: { rtl: false }
  }

  // Fallbacks for unnormalized language codes from our backend
  fallbacks: FallbacksType = {
    kmr: ['kmr'],
    ckb: ['ku'],
    'fa-AF': ['fa'],
    fa_pr: ['fa'],
    per: ['fa'],
    'de-si': ['de']
  }

  defaultFallback = 'de' // If the language code is not found in our translations then use this

  constructor () {
    this.checkConsistency()
  }

  getSupportedLanguageCodes (): string[] {
    return Object.keys(this.supportedLanguages)
  }

  getRTLLanguages (): string[] {
    return entries(this.supportedLanguages)
      .filter(([_, languageConfig]) => languageConfig.rtl)
      .map(([languageCode, _]) => languageCode)
  }

  isRTLLanguage (languageCode: string): boolean {
    return this.getRTLLanguages().includes(languageCode)
  }

  getAdditionalFont (languageCode: string): ?FontType {
    return this.supportedLanguages[languageCode]?.additionalFont
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
