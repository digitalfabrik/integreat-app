import { SnackbarStateType } from '../StateType'
import { StoreActionType } from '../StoreActionType'

// Necessary for reducers
// eslint-disable-next-line default-param-last
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
