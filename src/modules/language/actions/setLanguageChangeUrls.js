import { createAction } from 'redux-actions'

export default createAction('SET_LANGUAGE_CHANGE_URLS',
  (mapLanguageToUrl, languages, availableLanguages = {}) => {
    const languageMapper = language => mapLanguageToUrl(language.code, availableLanguages[language.code])

    return languages.reduce((accumulator, language) => ({
      ...accumulator,
      [language.code]: languageMapper(language)
    }), {})
  }
)
