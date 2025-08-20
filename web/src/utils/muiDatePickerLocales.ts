import {
  bgBG,
  csCZ,
  daDK,
  deDE,
  elGR,
  enUS,
  esES,
  fiFI,
  frFR,
  hrHR,
  huHU,
  itIT,
  nlNL,
  plPL,
  ptPT,
  roRO,
  ruRU,
  skSK,
  svSE,
  trTR,
  ukUA,
  zhCN,
} from '@mui/x-date-pickers/locales'

const LOCALE_MAP = {
  bg: bgBG,
  cs: csCZ,
  da: daDK,
  de: deDE,
  el: elGR,
  en: enUS,
  es: esES,
  fi: fiFI,
  fr: frFR,
  hr: hrHR,
  hu: huHU,
  it: itIT,
  nl: nlNL,
  pl: plPL,
  pt: ptPT,
  ro: roRO,
  ru: ruRU,
  sk: skSK,
  sv: svSE,
  tr: trTR,
  uk: ukUA,
  'zh-CN': zhCN,
}

type SupportedLanguageCode = keyof typeof LOCALE_MAP

/**
 * Get MUI date picker locale text for the given language code
 * @param languageCode - The language code (e.g., 'de', 'fr', 'es')
 * @returns MUI locale text object or undefined for unsupported languages
 */
export const getDatePickerLocaleText = (languageCode: string): Record<string, unknown> | undefined => {
  if (languageCode in LOCALE_MAP) {
    return LOCALE_MAP[languageCode as SupportedLanguageCode].components.MuiLocalizationProvider.defaultProps.localeText
  }
  return undefined
}
