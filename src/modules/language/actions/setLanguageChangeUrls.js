import { createAction } from 'redux-actions'

export const setLanguageChangeUrls = createAction('SET_LANGUAGE_CHANGE_URLS',
  (mapLanguageToUrl, languages, availableLanguages = undefined) => (
    availableLanguages
      // languageChange of a specific page/event with ids in availableLanguages
      ? languages.reduce((accumulator, language) => ({
        ...accumulator,
        [language.code]: mapLanguageToUrl(
            language.code,
            availableLanguages[language.code]
          )}), {})
    : languages.reduce((accumulator, language) => ({
      ...accumulator,
      [language.code]: mapLanguageToUrl(language.code, undefined)
    }), {}))
  )
