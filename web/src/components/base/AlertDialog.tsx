import CloseIcon from '@mui/icons-material/Close'
import MuiDialog, { dialogClasses } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LAYOUT_ELEMENT_ID } from '../Layout'

const StyledMuiDialog = styled(MuiDialog)(({ theme }) => ({
  [`.${dialogClasses.paper}`]: {
    margin: theme.spacing(1),
    width: '90%',
    [theme.breakpoints.up('md')]: {
      width: 560,
    },
  },
}))

type DialogProps = {
  title: string
  actions?: ReactElement | null
  close: () => void
  children: ReactElement | ReactElement[]
  className?: string
  hideCloseButton?: boolean
}

const AlertDialog = ({
  title,
  close,
  children,
  className,
  actions,
  hideCloseButton = false,
}: DialogProps): ReactElement => {
  const { t } = useTranslation('layout')

  // This is necessary to ensure the theme is correctly applied to the drawer content
  const dialogContainer = document.getElementById(LAYOUT_ELEMENT_ID)

  return (
    <StyledMuiDialog role='alertdialog' onClose={close} container={dialogContainer} className={className} open>
      <Stack direction='row' alignItems='center' justifyContent='space-between' marginInline={1}>
        <DialogTitle component='h2' variant='h4' textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
          {title}
        </DialogTitle>
        {!hideCloseButton && (
          <IconButton aria-label={t('common:close')} onClick={close}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <DialogContent>{children}</DialogContent>
      {actions}
    </StyledMuiDialog>
  )
}

export default AlertDialog
