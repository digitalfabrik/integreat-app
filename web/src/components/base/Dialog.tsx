import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import MuiDialog, { dialogClasses } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle, { dialogTitleClasses } from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
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

const StyledHeader = styled(Paper)(({ theme }) => ({
  zIndex: 1,
  margin: 0,
  padding: theme.spacing(2),
  alignItems: 'center',
  backgroundColor: theme.palette.background.accent,

  [`.${dialogTitleClasses.root}`]: {
    padding: 0,
  },
})) as typeof Paper

const StyledDialogTitle = styled(DialogTitle)({
  flex: '1 1 0',
}) as typeof DialogTitle

type DialogHeaderProps = {
  title: string
  subtitle?: string
  icon?: ReactElement | null
  actions?: ReactElement[] | null
  close: () => void
  desktop: boolean
  minimize?: boolean
  className?: string
  compact?: boolean
}

export const DialogHeader = ({
  title,
  subtitle,
  icon,
  close,
  actions,
  className,
  desktop,
  minimize = false,
  compact = false,
}: DialogHeaderProps): ReactElement => {
  const { contentDirection } = useTheme()
  const { t } = useTranslation()
  const closeIcon = minimize ? <RemoveIcon /> : <CloseIcon />

  const Actions = actions ? (
    <Stack direction='row' sx={{ gap: 1, alignItems: 'center' }}>
      {actions}
    </Stack>
  ) : null

  return (
    <StyledHeader
      component={Stack}
      direction={desktop ? 'row-reverse' : 'row'}
      className={className}
      elevation={2}
      sx={{ justifyContent: desktop ? 'space-between' : undefined, paddingBlock: compact ? 1.5 : undefined }}>
      <IconButton
        size={compact ? 'small' : 'medium'}
        aria-label={t($ => (minimize ? $.common.actions.minimize : $.common.actions.close))}
        onClick={close}>
        {desktop ? closeIcon : <DirectionDependentBackIcon />}
      </IconButton>
      {desktop && Actions}
      <StyledDialogTitle component='div' dir={contentDirection}>
        <Stack direction='row' sx={{ alignItems: 'center', gap: compact ? 1 : 2 }}>
          {icon}
          <Stack sx={{ lineHeight: compact ? 1 : undefined }}>
            <Typography component='h2' variant={compact ? 'subtitle2' : 'h4'}>
              {title}
            </Typography>
            {!!subtitle && <Typography variant={compact ? 'caption' : 'body3'}>{subtitle}</Typography>}
          </Stack>
        </Stack>
      </StyledDialogTitle>
      {!desktop && Actions}
    </StyledHeader>
  )
}

type DialogProps = Omit<DialogHeaderProps, 'desktop'> & {
  children: ReactElement | ReactElement[]
  className?: string
  showHeader?: boolean
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

  // This is necessary to ensure the theme is correctly applied to the drawer content
  const dialogContainer = document.getElementById(LAYOUT_ELEMENT_ID)

  return (
    <StyledMuiDialog onClose={close} container={dialogContainer} fullScreen={mobile} className={className} open>
      {showHeader && (
        <DialogHeader
          title={title}
          subtitle={subtitle}
          icon={icon}
          actions={actions}
          minimize={minimize}
          close={close}
          desktop={desktop}
        />
      )}
      <DialogContent>{children}</DialogContent>
    </StyledMuiDialog>
  )
}

export default Dialog
