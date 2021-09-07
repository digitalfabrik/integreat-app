import { EnqueueSnackbarActionType, StoreActionType } from '../redux/StoreActionType'
import { Dispatch } from 'react'

const showSnackbar = (dispatch: Dispatch<StoreActionType>, message: string): void => {
  const enqueueSnackbar: EnqueueSnackbarActionType = {
    type: 'ENQUEUE_SNACKBAR',
    params: {
      text: message
    }
  }
  dispatch(enqueueSnackbar)
}

export default showSnackbar
