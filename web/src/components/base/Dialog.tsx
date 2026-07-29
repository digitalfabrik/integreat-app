import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import MuiDialog, { dialogClasses } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LAYOUT_ELEMENT_ID } from '../../constants/layout'
import useDimensions from '../../hooks/useDimensions'

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
  subtitle?: string
  icon?: ReactElement | null
  actions?: ReactElement[] | null
  close: () => void
  children: ReactElement | ReactElement[]
  className?: string
  showHeader?: boolean
  minimize?: boolean
}

const Dialog = ({
  title,
  subtitle,
  icon,
  close,
  children,
  className,
  actions,
  showHeader = true,
  minimize = false,
}: DialogProps): ReactElement => {
  const { mobile, desktop } = useDimensions()
  const { contentDirection } = useTheme()
  const { t } = useTranslation('layout')
  const closeIcon = minimize ? <RemoveIcon /> : <CloseIcon />

  // This is necessary to ensure the theme is correctly applied to the drawer content
  const dialogContainer = document.getElementById(LAYOUT_ELEMENT_ID)

  const Actions = actions ? (
    <Stack direction='row' gap={1} alignItems='center'>
      {actions}
    </Stack>
  ) : null

  return (
    <StyledMuiDialog onClose={close} container={dialogContainer} fullScreen={mobile} className={className} open>
      {showHeader && (
        <Stack
          direction={desktop ? 'row-reverse' : 'row'}
          alignItems='center'
          justifyContent={desktop ? 'space-between' : undefined}
          marginInline={1}>
          <IconButton aria-label={t(minimize ? 'common:minimize' : 'common:close')} onClick={close}>
            {desktop ? closeIcon : <DirectionDependentBackIcon />}
          </IconButton>
          {desktop && Actions}
          <StyledDialogTitle component='div' dir={contentDirection}>
            <Stack direction='row' alignItems='center' gap={1.5}>
              {icon}
              <Stack minWidth={0}>
                <Typography component='h2' variant='h4' noWrap>
                  {title}
                </Typography>
                {!!subtitle && <Typography variant='body3'>{subtitle}</Typography>}
              </Stack>
            </Stack>
          </StyledDialogTitle>
          {mobile && Actions}
        </Stack>
      )}
      <DialogContent>{children}</DialogContent>
    </StyledMuiDialog>
  )
}

export default Dialog
