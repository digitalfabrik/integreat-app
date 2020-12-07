module.exports = {
  // The language from which we translate
  sourceLanguage: 'de',
  // The languages to which we translate
  targetLanguages: {
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
    kmr: { rtl: true }
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
}
