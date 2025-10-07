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

import { SNACKBAR_AUTO_HIDE_DURATION } from 'shared'

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
  severity: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
}

const Snackbar = ({ open, onClose, severity, message, title, dashboardRoute }: SnackbarProps): ReactElement => {
  const { t } = useTranslation('common')

  return (
    <StyledMuiSnackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={severity === 'success' ? SNACKBAR_AUTO_HIDE_DURATION : null}>
      <StyledAlert
        severity={severity}
        role='alert'
        onClose={onClose}
        variant={severity === 'error' ? 'filled' : 'standard'}
        action={
          // eslint-disable-next-line no-nested-ternary
          severity === 'success' && dashboardRoute ? (
            <Button component={Link} to={dashboardRoute} size='small'>
              {t('error:goTo.categories')}
            </Button>
          ) : severity === 'success' ? (
            <IconButton aria-label={t('close')} color='inherit' size='small' onClick={onClose}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          ) : null
        }>
        {severity === 'error' && !!title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </StyledAlert>
    </StyledMuiSnackbar>
  )
}

export default Snackbar
