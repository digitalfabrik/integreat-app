// @flow

import { createAction } from 'redux-actions'
import type { SetUiDirectionActionType } from '../../app/StoreActionType'

export type UiDirectionType = 'ltr' | 'rtl'

export default (direction: UiDirectionType): SetUiDirectionActionType => createAction('SET_UI_DIRECTION')(direction)
