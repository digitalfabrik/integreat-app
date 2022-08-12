import { Dispatch } from 'react'

import { EnqueueSnackbarActionType, StoreActionType } from '../redux/StoreActionType'

const showSnackbar = (dispatch: Dispatch<StoreActionType>, message: string): void => {
  const enqueueSnackbar: EnqueueSnackbarActionType = {
    type: 'ENQUEUE_SNACKBAR',
    params: {
      text: message,
    },
  }
  dispatch(enqueueSnackbar)
}

export default showSnackbar
