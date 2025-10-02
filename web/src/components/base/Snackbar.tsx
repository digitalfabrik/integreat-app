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

import { ExtendedSendingStatusType, SNACKBAR_AUTO_HIDE_DURATION } from 'shared'

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
  sendingStatus: ExtendedSendingStatusType
  dashboardRoute?: string
  successMessage?: string
  errorMessage?: string
  errorTitle?: string
  autoHideOnSuccess?: boolean
}

const Snackbar = ({
  open,
  onClose,
  sendingStatus,
  dashboardRoute,
  autoHideOnSuccess = false,
  successMessage,
  errorMessage,
  errorTitle,
}: SnackbarProps): ReactElement => {
  const { t } = useTranslation('malteHelpForm')

  return (
    <StyledMuiSnackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideOnSuccess && sendingStatus === 'successful' ? SNACKBAR_AUTO_HIDE_DURATION : null}>
      {sendingStatus === 'failed' || sendingStatus === 'invalidEmail' ? (
        <Alert severity='error' role='alert' onClose={onClose} variant='filled'>
          <AlertTitle>{errorTitle ?? t('submitFailed')}</AlertTitle>
          {errorMessage}
        </Alert>
      ) : (
        <StyledAlert
          severity='success'
          role='alert'
          onClose={onClose}
          action={
            <>
              {dashboardRoute ? (
                <Button component={Link} to={dashboardRoute} size='small'>
                  {t('error:goTo.categories')}
                </Button>
              ) : (
                <IconButton aria-label={t('common:close')} color='inherit' size='small' onClick={onClose}>
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              )}
            </>
          }>
          {successMessage ?? t('submitSuccessful')}
        </StyledAlert>
      )}
    </StyledMuiSnackbar>
  )
}

export default Snackbar
