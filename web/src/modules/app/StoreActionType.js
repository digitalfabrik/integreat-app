// @flow

import type { StartFetchActionType } from './actions/startFetchAction'
import type { FinishFetchActionType } from './actions/finishFetchAction'

export type SetLanguageActionType = { type: 'SET_LANGUAGE', payload: string }

export type SetCurrentCityActionType = { type: 'SET_CURRENT_CITY', payload: string }

export type ToggleDarkModeActionType = { type: 'TOGGLE_DARK_MODE' }

export type StoreActionType =
  StartFetchActionType<*>
  | FinishFetchActionType<*, *>
  | SetLanguageActionType
  | SetCurrentCityActionType
  | ToggleDarkModeActionType
