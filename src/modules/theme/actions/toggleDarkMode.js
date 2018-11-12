// @flow

import { createAction } from 'redux-actions'

export type ToggleDarkModeActionType = { type: 'TOGGLE_DARK_MODE' }

export default (): ToggleDarkModeActionType => createAction('TOGGLE_DARK_MODE')()
