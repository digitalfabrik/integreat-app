type FontType =
  | 'notoSans'
  | 'raleway'
  | 'varelaRound'
  | 'noto-sans-sc' // https://www.google.com/get/noto/help/cjk/
  | 'noto-sans-georgian'
  | 'noto-sans-arabic'
export type UiDirectionType = 'rtl' | 'ltr'
type LanguageType = {
  rtl: boolean
  additionalFont?: FontType
}
type SupportedLanguagesType = Record<string, LanguageType>
type FallbacksType = Record<string, string[]>

class Config {
  // The language from which we translate
  sourceLanguage = 'de'
  // The languages into which we translate from 'sourceLanguage' including the sourceLanguage
  // See https://wiki.tuerantuer.org/integreat-languages and https://iso639-3.sil.org/code_tables/639/data
  supportedLanguages: SupportedLanguagesType = {
    de: {
      rtl: false,
    },
    ar: {
      // Lateef for arabic ui and content, Open Sans for latin text in arabic text, Raleway for latin ui
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    en: {
      rtl: false,
    },
    pes: {
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    fr: {
      rtl: false,
    },
    ro: {
      rtl: false,
    },
    tr: {
      rtl: false,
    },
    pl: {
      rtl: false,
    },
    ti: {
      rtl: false,
    },
    ckb: {
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    ru: {
      rtl: false,
    },
    so: {
      rtl: false,
    },
    hr: {
      rtl: false,
    },
    es: {
      rtl: false,
    },
    'sr-Latn': {
      rtl: false,
    },
    'sr-Cyrl': {
      rtl: false,
    },
    ps: {
      rtl: true,
    },
    kmr: {
      rtl: false,
    },
    am: {
      rtl: false,
    },
    bg: {
      rtl: false,
    },
    el: {
      rtl: false,
    },
    it: {
      rtl: false,
    },
    'zh-CN': {
      rtl: false,
      additionalFont: 'noto-sans-sc',
    },
    mk: {
      rtl: false,
    },
    sq: {
      rtl: false,
    },
    ka: {
      rtl: false,
      additionalFont: 'noto-sans-georgian',
    },
    prs: {
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    hu: {
      rtl: false,
    },
    ur: {
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    uk: {
      rtl: false,
    },
    fi: {
      rtl: false,
    },
    nl: {
      rtl: false,
    },
    pt: {
      rtl: false,
    },
    cs: {
      rtl: false,
    },
    'pt-br': {
      rtl: false,
    },
  }

  // Fallbacks for unnormalized language codes from our backend
  fallbacks: FallbacksType = {
    ku: ['kmr'],
    fa: ['pes'],
    'fa-AF': ['prs'],
    fa_pr: ['pes'],
    'de-si': ['de'],
    sr: ['sr-Cyrl'],
    'zh-hans': ['zh-CN'],
    // Slugs from the CMS are (and have to be) lowercase
    'sr-cyrl': ['sr-Cyrl'],
    'sr-latn': ['sr-Latn'],
    'zh-cn': ['zh-CN'],
  }

  defaultFallback = 'de' // If the language code is not found in our translations then use this

  constructor() {
    this.checkConsistency()
  }

  getSupportedLanguageTags(): string[] {
    return Object.keys(this.supportedLanguages)
  }

  /**
   * Returns the passed languageTag if it is supported or that of a supported fallback or undefined if not supported
   */
  getLanguageTagIfSupported(languageTag: string): string | undefined {
    return this.getSupportedLanguageTags().find(
      key => key === languageTag || this.fallbacks[languageTag]?.includes(key)
    )
  }

  getSupportedLanguage(languageTag: string): LanguageType | undefined {
    const fallbacks = this.fallbacks[languageTag]

    if (fallbacks) {
      const found = fallbacks.find(fallback => !!this.supportedLanguages[fallback])

      if (found) {
        return this.supportedLanguages[found]
      }
    }

    return this.supportedLanguages[languageTag]
  }

  isSupportedLanguage(languageTag: string): boolean {
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
   * This only works for {@link #supportedLanguages} and not for arbitrary ones in which case we just return false.
   * This is because we simply do now know it and cannot know it.
   *
   * @see http://www.i18nguy.com/temp/rtl.html
   * @param languageTag for the check
   * @returns {*} whether script is RTL
   */
  hasRTLScript(languageTag: string): boolean {
    const language = this.getSupportedLanguage(languageTag)

    if (!language) {
      return false
    }

    return language.rtl
  }

  getScriptDirection(languageTag: string): UiDirectionType {
    return this.hasRTLScript(languageTag) ? 'rtl' : 'ltr'
  }

  getAdditionalFont(languageTag: string): FontType | null | undefined {
    return this.getSupportedLanguage(languageTag)?.additionalFont
  }

  getFallbackLanguageTags(): string[] {
    return Object.keys(this.fallbacks)
  }

  getFallbackTargetLanguageTags(): string[] {
    const languageTags: string[] = []
    const fallbacks: string[][] = Object.values(this.fallbacks)
    fallbacks.forEach((languagesInFallbacks: string[]) => {
      languagesInFallbacks.forEach((languageTag: string) => {
        languageTags.push(languageTag)
      })
    })
    return languageTags
  }

  checkConsistency() {
    const supportedLanguageTags = this.getSupportedLanguageTags()
    this.getFallbackTargetLanguageTags().forEach((languageTag: string) => {
      if (!supportedLanguageTags.includes(languageTag)) {
        throw Error(`The code ${languageTag} was mentioned in the fallbacks but is not included in 'targetLanguage'`)
      }
    })
  }
}

export default new Config()
