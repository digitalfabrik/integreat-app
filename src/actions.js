import { createAction } from 'redux-actions'

export const setLanguageChangeUrls = createAction('SET_LANGUAGE_CHANGE_URLS',
  (languageChangeUrls) => (languageChangeUrls)
)

export const setAvailableLanguages = createAction('SET_AVAILABLE_LANGUAGES',
  (availableLanguages) => (availableLanguages)
)
