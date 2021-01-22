// @flow

import { values } from './utils/object'

type FontType = 'lateef' | 'openSans' | 'raleway'
type LanguageType = {| rtl: boolean, additionalFont?: FontType |}
type SupportedLanguagesType = { [languageCode: string]: LanguageType}
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

  getSupportedLanguage (languageCode: string): LanguageType | void {
    const fallbacks = this.fallbacks[languageCode]

    if (fallbacks) {
      const found = fallbacks.find(fallback => !!this.supportedLanguages[fallback])

      if (found) {
        return this.supportedLanguages[found]
      }
    }

    return this.supportedLanguages[languageCode]
  }

  isSupportedLanguage (languageCode: string): boolean {
    return !!this.getSupportedLanguage(languageCode)
  }

  /**
   * Checks whether the languageCode has an RTL script. This decision is made by the project "Integreat".
   * Writing direction is not an attribute of "language", but of "scripts". That means that there are language which
   * can have RTL and LTR scripts.
   *
   * <b>Typical Usage</b>
   *
   * If you do not know whether to display UI elements RTL/LTR you can use this method. Browsers for example, do not
   * disclose the system script direction. On Android you can use the system libraries instead of this method. This only
   * works for {@link #supportedLanguages} and not for arbitrary ones. This is because we simply do now know it and can
   * not know it.
   *
   * @see http://www.i18nguy.com/temp/rtl.html
   * @param languageCode for the check
   * @returns {*} whether script is RTL
   */
  hasRTLScript (languageCode: string): boolean {
    const language = this.getSupportedLanguage(languageCode)

    if (!language) {
      throw new Error(`Unable to determine whether ${languageCode} uses a RTL script. 
                        Only supported languages have a defined direction.`)
    }

    return language.rtl
  }

  getAdditionalFont (languageCode: string): ?FontType {
    return this.getSupportedLanguage(languageCode)?.additionalFont
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
