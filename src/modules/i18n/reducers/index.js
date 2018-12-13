// @flow

import { type ActionType, handleAction, type ReduxReducer } from 'redux-actions'
import setUIDirection from '../actions/setUIDirection'
import setLanguage from '../actions/setLanguage'
import type { DirectionStateType, LanguageStateType } from '../../app/StateType'
import type { SetLanguageActionType, SetUiDirectionActionType } from '../../app/StoreActionType'

const uiDirectionReducer_: ReduxReducer<DirectionStateType, SetUiDirectionActionType> =
  handleAction(
    'SET_UI_DIRECTION',
    (state: DirectionStateType, { payload }: ActionType<typeof setUIDirection>) => payload,
    'ltr'
  )

export const uiDirectionReducer = uiDirectionReducer_

const languageReducer_: ReduxReducer<LanguageStateType, SetLanguageActionType> =
  handleAction(
    'SET_LANGUAGE',
    (state: LanguageStateType, { payload }: ActionType<typeof setLanguage>) => payload,
    'en'
  )

export const languageReducer = languageReducer_
