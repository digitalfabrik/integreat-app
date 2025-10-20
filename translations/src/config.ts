type FontType =
  | 'notoSans'
  | 'raleway'
  | 'varelaRound'
  | 'noto-sans-sc' // https://www.google.com/get/noto/help/cjk/
  | 'noto-sans-georgian'
  | 'noto-sans-arabic'
export type UiDirectionType = 'rtl' | 'ltr'
type LanguageType = {
  name: string
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
    am: {
      name: 'ኣማርኛ',
      rtl: false,
    },
    ar: {
      name: 'العربية',
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    bg: {
      name: 'Български',
      rtl: false,
    },
    ckb: {
      name: 'سۆرانی',
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    cs: {
      name: 'čeština',
      rtl: false,
    },
    da: {
      name: 'Dansk',
      rtl: false,
    },
    de: {
      name: 'Deutsch',
      rtl: false,
    },
    el: {
      name: 'Ελληνικα',
      rtl: false,
    },
    en: {
      name: 'English',
      rtl: false,
    },
    es: {
      name: 'Español',
      rtl: false,
    },
    fi: {
      name: 'suomi',
      rtl: false,
    },
    fr: {
      name: 'Français',
      rtl: false,
    },
    hi: {
      name: '(हिन्दी)',
      rtl: false,
    },
    hr: {
      name: 'Hrvatski',
      rtl: false,
    },
    hu: {
      name: 'Magyar',
      rtl: false,
    },
    id: {
      name: 'Bahasa Indonesia',
      rtl: false,
    },
    it: {
      name: 'Italiano',
      rtl: false,
    },
    ka: {
      name: 'ქართული ენა',
      rtl: false,
      additionalFont: 'noto-sans-georgian',
    },
    kmr: {
      name: 'Kurmancî',
      rtl: false,
    },
    mk: {
      name: 'македонски',
      rtl: false,
    },
    nl: {
      name: 'Nederlands',
      rtl: false,
    },
    om: {
      name: 'Afaan Oromoo',
      rtl: false,
    },
    pes: {
      name: 'فارسی',
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    pl: {
      name: 'Polski',
      rtl: false,
    },
    prs: {
      name: 'دری',
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    ps: {
      name: 'پښتو',
      rtl: true,
    },
    pt: {
      name: 'Português',
      rtl: false,
    },
    ro: {
      name: 'Română',
      rtl: false,
    },
    rom: {
      name: 'Romani čhib',
      rtl: false,
    },
    ru: {
      name: 'Русский',
      rtl: false,
    },
    sk: {
      name: 'Slovenčina',
      rtl: false,
    },
    so: {
      name: 'Af Soomaali',
      rtl: false,
    },
    sq: {
      name: 'Shqip',
      rtl: false,
    },
    'sr-Cyrl': {
      name: 'српски',
      rtl: false,
    },
    'sr-Latn': {
      name: 'Srpski',
      rtl: false,
    },
    sw: {
      name: 'Kiswahili',
      rtl: false,
    },
    th: {
      name: 'ภาษาไทย',
      rtl: false,
    },
    ti: {
      name: 'ትግርኛ',
      rtl: false,
    },
    tr: {
      name: 'Türkçe',
      rtl: false,
    },
    uk: {
      name: 'Українська',
      rtl: false,
    },
    ur: {
      name: 'اردو',
      rtl: true,
      additionalFont: 'noto-sans-arabic',
    },
    vi: {
      name: 'tiếng Việt',
      rtl: false,
    },
    'zh-CN': {
      name: '简体中文',
      rtl: false,
      additionalFont: 'noto-sans-sc',
    },
  }

  fallbacks: FallbacksType = {
    ku: ['kmr'],
    fa: ['pes'],
    'fa-AF': ['prs'],
    fa_pr: ['pes'],
    'de-si': ['de'],
    sr: ['sr-Cyrl'],
    'pt-br': ['pt'],
    'zh-hans': ['zh-CN'],
    zh: ['zh-CN'],
    // Slugs from the CMS are (and have to be) lowercase
    'sr-cyrl': ['sr-Cyrl'],
    'sr-latn': ['sr-Latn'],
    'zh-cn': ['zh-CN'],
  }

  // If the language code is not found in our translations then use this
  defaultFallback = 'de'

  // Fallbacks for unnormalized language codes from our backend
  getTranslationFallbacks(): FallbacksType {
    return Object.fromEntries(
      Object.entries(this.fallbacks).map(([key, value]) => [key, [...value, this.defaultFallback]]),
    )
  }

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
      key => key === languageTag || this.fallbacks[languageTag]?.includes(key),
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
