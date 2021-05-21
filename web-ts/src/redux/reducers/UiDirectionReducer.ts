import { handleAction } from 'redux-actions'

export type DirectionStateType = 'ltr' | 'rtl';
const uiDirectionReducer =
  handleAction<DirectionStateType, DirectionStateType>('SET_UI_DIRECTION', (state: DirectionStateType, { payload }) => payload, 'ltr')

export default uiDirectionReducer