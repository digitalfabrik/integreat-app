// @flow

import { createAction } from 'redux-actions'
import type { Action } from 'redux-first-router/dist/flow-types'

export const setUiDirectionAction = 'SET_UI_DIRECTION'

const setUiDirection = (direction: 'ltr' | 'rtl'): Action => createAction(setUiDirectionAction)(direction)

export default setUiDirection
