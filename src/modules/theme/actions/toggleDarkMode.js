// @flow

import { createAction } from 'redux-actions'

export const toggleDarkModeAction = createAction<string, empty>('TOGGLE_DARK_MODE')

export default toggleDarkModeAction
