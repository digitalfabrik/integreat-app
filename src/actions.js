import { createAction } from 'redux-actions'

export const setCurrentAvailableLanguages = createAction('SET_CURRENT_AVAILABLE_LANGUAGES',
  (page) => page.availableLanguages
)
