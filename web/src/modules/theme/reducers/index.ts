// @flow

import { handleAction, type ReduxReducer } from 'redux-actions'

const toggleDarkModeReducer: ReduxReducer<boolean, { type: 'TOGGLE_DARK_MODE', payload: boolean }> = handleAction(
  'TOGGLE_DARK_MODE',
  (state: boolean) => !state,
  false
)

export default toggleDarkModeReducer
