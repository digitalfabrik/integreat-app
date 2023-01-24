import { useContext } from 'react'

import { SnackbarType } from '../components/Snackbar'
import { SnackbarContext } from '../components/SnackbarContainer'

const useSnackbar = (): ((snackbar: SnackbarType) => void) => useContext(SnackbarContext)

export default useSnackbar
