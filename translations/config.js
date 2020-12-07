const checkConsistency = (config) => {

  const supportedLanguageCodes = Object.keys(config.supportedLanguages)

  const languagesInFallbacks = Object.values(config.fallbacks).flat()

  languagesInFallbacks.forEach(languageCode => {
    if (!supportedLanguageCodes.includes(languageCode)) {
      throw Error(`The code ${languageCode} was mentioned in the fallbacks but is not included in 'targetLanguage'`)
    }
  })

  return config
}

module.exports = checkConsistency({
  // The language from which we translate
  sourceLanguage: 'de',
  // The languages into which we translate from 'sourceLanguage' including the sourceLanguage
  supportedLanguages: {
    de: {},
    ar: { rtl: true },
    en: {},
    fa: { rtl: true },
    fr: {},
    ro: {},
    tr: {},
    pl: {},
    ti: {},
    ku: {},
    ru: {},
    so: {},
    hr: {},
    es: {},
    sr: {},
    ps: { rtl: true },
    kmr: { rtl: true },
    am: {},
    bg: {},
    el: {},
    it: {}
  },
  // Fallbacks for unnormalized language codes from our backend
  fallbacks: {
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
  },
  // If the language code is not found in our translations then use this 
  defaultFallback: 'de'
})
