import MUISnackbar from '@mui/material/Snackbar'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const StyledMuiSnackbar = styled(MUISnackbar)(({ theme }) => ({
  marginBottom: theme.dimensions.bottomNavigationHeight,
}))

type SnackbarProps = {
  open: boolean
  onClose: () => void
  autoHideDuration?: number | null
  children: ReactElement
}

export const Snackbar = ({ open, onClose, autoHideDuration, children }: SnackbarProps): ReactElement => (
  <StyledMuiSnackbar
    open={open}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    autoHideDuration={autoHideDuration ?? null}>
    {children}
  </StyledMuiSnackbar>
)
export default Snackbar
