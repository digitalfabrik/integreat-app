// @flow

import { handleAction } from 'redux-actions'
import { toggleDarkModeAction } from '../actions/toggleDarkMode'

export default handleAction(toggleDarkModeAction, state => !state, false)
