// @flow

import { createAction } from 'redux-actions'
import type { SetUiDirectionActionType } from '../../app/StoreActionType'

export default (direction: 'ltr' | 'rtl'): SetUiDirectionActionType => createAction('SET_UI_DIRECTION')(direction)
