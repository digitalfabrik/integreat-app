import { useDispatch } from 'react-redux'

import showSnackbar from '../utils/showSnackbar'

const useSnackbar = (): ((error: Error) => void) => {
  const dispatch = useDispatch()
  return (error: Error) => showSnackbar(dispatch, error.message)
}

export default useSnackbar
