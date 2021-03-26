// @flow

import type { SnackbarStateType } from './StateType'
import type { StoreActionType } from './StoreActionType'

export default (state: SnackbarStateType = [], action: StoreActionType): SnackbarStateType => {
  switch (action.type) {
    case 'PUSH_SNACKBAR':
      return [...state, action.params]
    case 'POP_SNACKBAR':
      return state.slice(1)
    default:
      return state
  }
}
