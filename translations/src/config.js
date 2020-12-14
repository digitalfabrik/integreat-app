// @flow

import { values } from './utils/object'

type ConfigType = {|
  sourceLanguage: string,
  supportedLanguages: { [languageCode: string]: {| rtl: boolean |} },
  fallbacks: { [languageCode: string]: string[] },
  defaultFallback: string
|}

const checkConsistency = (config: ConfigType): ConfigType => {
  const supportedLanguageCodes = Object.keys(config.supportedLanguages)

  const fallbacks: string[][] = values(config.fallbacks)

  fallbacks.forEach((languagesInFallbacks: string[]) => {
    languagesInFallbacks.forEach((languageCode: string) => {
      if (!supportedLanguageCodes.includes(languageCode)) {
        throw Error(`The code ${languageCode} was mentioned in the fallbacks but is not included in 'targetLanguage'`)
      }
    })
  })

  return config
}

const config: ConfigType = {
  // The language from which we translate
  sourceLanguage: 'de',
  // The languages into which we translate from 'sourceLanguage' including the sourceLanguage
  supportedLanguages: {
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
module.exports = checkConsistency(config)
