import { createAction } from 'redux-actions'

export const setAvailableLanguages = createAction('SET_AVAILABLE_LANGUAGES',
  (availableLanguages) => (availableLanguages)
)
