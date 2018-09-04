import { handleAction } from 'redux-actions'
import { setUiDirectionAction } from '../actions/setUIDirection'
import { setLanguageAction } from '../actions/setLanguage'

export const uiDirectionReducer = handleAction(setUiDirectionAction, (state, action) => action.payload, 'ltr')

export const languageReducer = handleAction(setLanguageAction, (state, action) => action.payload, 'en')
