// @flow

import { createAction } from 'redux-actions'

export const setLanguageAction = 'SET_LANGUAGE'

const setLanguage = (language: string) => createAction(setLanguageAction)(language)

export default setLanguage
