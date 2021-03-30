// @flow

import { values } from './utils/object'

type FontType = 'lateef'
  | 'openSans'
  | 'raleway'
  | 'varelaRound'
  | 'noto-sans-sc' // https://www.google.com/get/noto/help/cjk/
type LanguageType = {| rtl: boolean, additionalFont?: FontType |}
type SupportedLanguagesType = { [languageTag: string]: LanguageType }
type FallbacksType = { [languageTag: string]: string[] }

class Config {
  // The language from which we translate
  sourceLanguage = 'de'

  // The languages into which we translate from 'sourceLanguage' including the sourceLanguage
  // See https://wiki.tuerantuer.org/integreat-languages and https://iso639-3.sil.org/code_tables/639/data
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
    it: { rtl: false },
    'zh-CN': {
      rtl: false,
      additionalFont: 'noto-sans-sc'
    },
    mk: { rtl: false },
    sq: { rtl: false }
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

  getSupportedLanguageTags (): string[] {
    return Object.keys(this.supportedLanguages)
  }

  getSupportedLanguage (languageTag: string): LanguageType | void {
    const fallbacks = this.fallbacks[languageTag]

    if (fallbacks) {
      const found = fallbacks.find(fallback => !!this.supportedLanguages[fallback])

      if (found) {
        return this.supportedLanguages[found]
      }
    }

    return this.supportedLanguages[languageTag]
  }

  isSupportedLanguage (languageTag: string): boolean {
    return !!this.getSupportedLanguage(languageTag)
  }

  /**
   * Checks whether the languageTag has an RTL script. This decision is made by the project "Integreat".
   * Writing direction is not an attribute of "language", but of "scripts". That means that there are languages which
   * can have RTL and LTR scripts.
   *
   * <b>Typical Usage</b>
   *
   * If you do not know whether to display UI elements RTL/LTR you can use this method. Browsers for example, do not
   * disclose the system script direction. On Android and iOS system libraries are used instead of this method
   * ({@link https://github.com/zoontek/react-native-localize/blob/de9c01ab99f69bcf655ed2cb83c7081b75298bd2/android/src/main/java/com/zoontek/rnlocalize/RNLocalizeModule.java#L191|Android})
   * ({@link https://github.com/zoontek/react-native-localize/blob/d8f265ee665cf593f98ef92b308f4416cd251b30/ios/RNLocalize.m#L113|iOS}).
   * This onlyworks for {@link #supportedLanguages} and not for arbitrary ones. This is because we simply do now know
   * it and cannot know it.
   *
   * @see http://www.i18nguy.com/temp/rtl.html
   * @param languageTag for the check
   * @returns {*} whether script is RTL
   */
  hasRTLScript (languageTag: string): boolean {
    const language = this.getSupportedLanguage(languageTag)

    if (!language) {
      throw new Error(`Unable to determine whether ${languageTag} uses a RTL script. 
                        Only supported languages have a defined direction.`)
    }

    return language.rtl
  }

  getAdditionalFont (languageTag: string): ?FontType {
    return this.getSupportedLanguage(languageTag)?.additionalFont
  }

  getFallbackLanguageTags (): string[] {
    return Object.keys(this.fallbacks)
  }
  
  getFallbackTargetLanguageTags (): string[] {
    const languageTags = []
    const fallbacks: string[][] = values(this.fallbacks)

    fallbacks.forEach((languagesInFallbacks: string[]) => {
      languagesInFallbacks.forEach((languageTag: string) => {
        languageTags.push(languageTag)
      })
    })

    return languageTags
  }

  checkConsistency () {
    const supportedLanguageTags = this.getSupportedLanguageTags()

    this.getFallbackTargetLanguageTags().forEach((languageTag: string) => {
      if (!supportedLanguageTags.includes(languageTag)) {
        throw Error(`The code ${languageTag} was mentioned in the fallbacks but is not included in 'targetLanguage'`)
      }
    })
  }
}

export default new Config()
