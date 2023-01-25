import { useContext } from 'react'

import { SnackbarType } from '../components/Snackbar'
import { SnackbarContext } from '../components/SnackbarContainer'

const useSnackbar = (): ((snackbar: SnackbarType, showDuration?: number) => void) => useContext(SnackbarContext)

export default useSnackbar
