// @flow

import { createAction } from 'redux-actions'

export const setUiDirectionAction = 'SET_UI_DIRECTION'

const setUiDirection = (direction: 'ltr' | 'rtl') => createAction(setUiDirectionAction)(direction)

export default setUiDirection
