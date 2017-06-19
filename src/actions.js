import { createAction } from 'redux-actions'

export const DEFAULT_LANGUAGE = 'de'

export const setLanguage = createAction('SET_LANGUAGE', (languageCode) => ({
  language: languageCode
}))
