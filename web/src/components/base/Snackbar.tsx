import Alert, { alertClasses, AlertColor } from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import MUISnackbar from '@mui/material/Snackbar'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import { SNACKBAR_AUTO_HIDE_DURATION } from 'shared'

const StyledMuiSnackbar = styled(MUISnackbar)(({ theme }) => ({
  marginBottom: theme.dimensions.bottomNavigationHeight,
}))

const StyledAlert = styled(Alert)`
  display: flex;
  align-items: center;

  .${alertClasses.action} {
    padding: 0 8px;
  }
`

export type SnackbarProps = {
  open: boolean
  onClose: () => void
  severity: AlertColor
  title?: string
  message: string
  action: ReactNode
}

const Snackbar = ({ open, onClose, severity, message, title, action }: SnackbarProps): ReactElement => (
  <StyledMuiSnackbar
    open={open}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    autoHideDuration={severity === 'success' ? SNACKBAR_AUTO_HIDE_DURATION : null}>
    <StyledAlert
      severity={severity}
      onClose={onClose}
      variant={severity === 'error' ? 'filled' : 'standard'}
      action={action}>
      {!!title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </StyledAlert>
  </StyledMuiSnackbar>
)

export default Snackbar
