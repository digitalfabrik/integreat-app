// @flow

import { handleAction, type ReduxReducer } from 'redux-actions'
import type { DirectionStateType } from '../../app/StateType'
import type { SetUiDirectionActionType } from '../../app/StoreActionType'

const uiDirectionReducer: ReduxReducer<DirectionStateType, SetUiDirectionActionType> =
  handleAction(
    'SET_UI_DIRECTION',
    (state: DirectionStateType, action: SetUiDirectionActionType) => action.params.direction,
    'ltr'
  )

export default uiDirectionReducer
