import { createAction } from 'redux-actions'

// TODO: make this configurable
export const DEFAULT_LANGUAGE = 'de'

/**
 * The setLanguage action to submit the language to the store
 */
export const setLanguage = createAction('SET_LANGUAGE', (languageCode) => ({
  language: languageCode
}))
