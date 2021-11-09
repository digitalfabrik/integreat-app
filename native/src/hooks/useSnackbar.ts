import { useDispatch } from 'react-redux'

import showSnackbar from '../utils/showSnackbar'

const useSnackbar = (): ((message: string) => void) => {
  const dispatch = useDispatch()
  return (message: string) => showSnackbar(dispatch, message)
}

export default useSnackbar
