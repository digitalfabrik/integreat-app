// @flow

import { createAction } from 'redux-actions'
import type { ToggleDarkModeActionType } from '../../app/StoreActionType'

export default (): ToggleDarkModeActionType => createAction('TOGGLE_DARK_MODE')()
