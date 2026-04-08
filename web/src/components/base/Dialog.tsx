import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import MuiDialog, { dialogClasses } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../../hooks/useDimensions'
import { LAYOUT_ELEMENT_ID } from '../Layout'

export const DirectionDependentBackIcon = styled(ArrowBackIcon)(({ theme }) => ({
  transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
}))

const StyledMuiDialog = styled(MuiDialog)(({ theme }) => ({
  [`.${dialogClasses.paper}`]: {
    [theme.breakpoints.up('md')]: {
      width: 600,
    },
  },
}))

const StyledDialogTitle = styled(DialogTitle)({
  flex: '1 1 0',
}) as typeof DialogTitle

type DialogProps = {
  title: string
  actions?: ReactElement[] | null
  close: () => void
  children: ReactElement | ReactElement[]
  className?: string
}

const Dialog = ({ title, close, children, className, actions }: DialogProps): ReactElement => {
  const { mobile, desktop } = useDimensions()
  const { t } = useTranslation('layout')

  // This is necessary to ensure the theme is correctly applied to the drawer content
  const dialogContainer = document.getElementById(LAYOUT_ELEMENT_ID)

  const Actions = actions ? (
    <Stack direction='row' gap={1} alignItems='center'>
      {actions}
    </Stack>
  ) : null

  return (
    <StyledMuiDialog onClose={close} container={dialogContainer} fullScreen={mobile} className={className} open>
      <Stack
        direction={desktop ? 'row-reverse' : 'row'}
        alignItems='center'
        justifyContent={desktop ? 'space-between' : undefined}
        marginInline={1}>
        <IconButton aria-label={t('common:close')} onClick={close}>
          {desktop ? <CloseIcon /> : <DirectionDependentBackIcon />}
        </IconButton>
        {desktop && Actions}
        <StyledDialogTitle component='h2' variant='h4' textOverflow='ellipsis' whiteSpace='nowrap' overflow='hidden'>
          {title}
        </StyledDialogTitle>
        {mobile && Actions}
      </Stack>
      <DialogContent>{children}</DialogContent>
    </StyledMuiDialog>
  )
}

export default Dialog
