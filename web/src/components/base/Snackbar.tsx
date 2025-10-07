import CloseIcon from '@mui/icons-material/Close'
import Alert, { alertClasses } from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MUISnackbar from '@mui/material/Snackbar'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { SendingStatusType, SNACKBAR_AUTO_HIDE_DURATION } from 'shared'

const StyledMuiSnackbar = styled(MUISnackbar)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: 40,
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: 46,
  },
}))

const StyledAlert = styled(Alert)`
  display: flex;
  align-items: center;

  .${alertClasses.action} {
    padding: 0 8px;
  }
`

type SnackbarCloseHandler = (
  event?: React.SyntheticEvent | Event,
  reason?: 'timeout' | 'clickaway' | 'escapeKeyDown',
) => void

export const handleClose =
  (setOpen: (open: boolean) => void): SnackbarCloseHandler =>
  (event?, reason?) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

export type SnackbarProps = {
  open: boolean
  onClose: SnackbarCloseHandler
  dashboardRoute?: string
  sendingStatus?: SendingStatusType
  title?: string
  message: string
}

const Snackbar = ({ open, onClose, sendingStatus, dashboardRoute, title, message }: SnackbarProps): ReactElement => {
  const { t } = useTranslation('common')
  const autoHideDuration = sendingStatus === 'successful' ? SNACKBAR_AUTO_HIDE_DURATION : null
  const severity = sendingStatus === 'failed' ? 'error' : 'success'

  return (
    <StyledMuiSnackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={autoHideDuration}>
      <StyledAlert
        severity={severity}
        role='alert'
        onClose={onClose}
        variant={sendingStatus === 'failed' ? 'filled' : 'standard'}
        action={
          sendingStatus === 'successful' && (
            <>
              {dashboardRoute ? (
                <Button component={Link} to={dashboardRoute} size='small'>
                  {t('error:goTo.categories')}
                </Button>
              ) : (
                <IconButton aria-label={t('close')} color='inherit' size='small' onClick={onClose}>
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              )}
            </>
          )
        }>
        {sendingStatus === 'failed' && <AlertTitle>{title}</AlertTitle>}
        {message}
      </StyledAlert>
    </StyledMuiSnackbar>
  )
}

export default Snackbar
