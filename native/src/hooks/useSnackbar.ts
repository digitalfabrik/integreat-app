import { useDispatch } from 'react-redux'

import showSnackbar from '../utils/showSnackbar'

export class SnackbarError extends Error {
  constructor(message: string) {
    super()

    this.message = message
  }
}

const useSnackbar = (): ((error: SnackbarError) => void) => {
  const dispatch = useDispatch()
  return (error: SnackbarError) => showSnackbar(dispatch, error.message)
}

export default useSnackbar
