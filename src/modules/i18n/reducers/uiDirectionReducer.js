// @flow

import { type ActionType, handleAction, type ReduxReducer } from 'redux-actions'
import setUIDirection from '../actions/setUIDirection'
import type { DirectionStateType } from '../../app/StateType'
import type { SetUiDirectionActionType } from '../../app/StoreActionType'

const uiDirectionReducer: ReduxReducer<DirectionStateType, SetUiDirectionActionType> =
  handleAction(
    'SET_UI_DIRECTION',
    (state: DirectionStateType, { payload }: ActionType<typeof setUIDirection>) => payload,
    'ltr'
  )

export default uiDirectionReducer
