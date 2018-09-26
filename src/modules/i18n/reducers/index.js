// @flow

import { type ActionType, handleAction } from 'redux-actions'
import setUIDirection from '../actions/setUIDirection'
import setLanguage from '../actions/setLanguage'
import type { DirectionStateType, LanguageStateType } from '../../app/StateType'

export const uiDirectionReducer = handleAction(
  'SET_UI_DIRECTION',
  (state: DirectionStateType, {payload}: ActionType<typeof setUIDirection>) => payload,
  'ltr'
)

export const languageReducer = handleAction(
  'SET_LANGUAGE',
  (state: LanguageStateType, {payload}: ActionType<typeof setLanguage>) => payload,
  'en'
)
