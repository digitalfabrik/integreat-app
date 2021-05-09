import type { SnackbarStateType } from './StateType'
import type { StoreActionType } from './StoreActionType'
export default (state: SnackbarStateType = [], action: StoreActionType): SnackbarStateType => {
  switch (action.type) {
    case 'ENQUEUE_SNACKBAR':
      return [...state, action.params]

    case 'DEQUEUE_SNACKBAR':
      return state.slice(1)

    default:
      return state
  }
}
