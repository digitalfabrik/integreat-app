// @flow

import { handleAction, type ReduxReducer } from 'redux-actions'
import type { ToggleDarkModeActionType } from '../../app/StoreActionType'

const toggleDarkModeReducer: ReduxReducer<boolean, ToggleDarkModeActionType> =
  handleAction(
    'TOGGLE_DARK_MODE',
    (state: boolean) => !state,
    false
  )

export default toggleDarkModeReducer
