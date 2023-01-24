import { useContext } from 'react'

import { SnackbarContext, SnackbarType } from '../components/SnackbarContainer'

const useSnackbar = (): ((snackbar: SnackbarType) => void) => useContext(SnackbarContext)

export default useSnackbar
