import ArrowForward from '@mui/icons-material/ArrowForward'
import ChatIcon from '@mui/icons-material/Chat'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import Avatar from '@mui/material/Avatar'
import DialogContent from '@mui/material/DialogContent'
import MuiList from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MuiPopover, { popoverClasses } from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { BESCHEID_CHECK_ROUTE, bescheidCheckName, CHAT_QUERY_KEY, getChatName, toQueryParams } from 'shared'

import buildConfig from '../constants/buildConfig'
import useQueryParam from '../hooks/useQueryParam'
import { ChatLogoAvatar } from './ChatAvatar'
import { DialogHeader } from './base/Dialog'
import Link from './base/Link'

const StyledPopover = styled(MuiPopover)({
  [`& .${popoverClasses.paper}`]: {
    maxWidth: 416,
    borderRadius: 16,
    overflow: 'hidden',
    gap: 8,
  },
})

const StyledList = styled(MuiList)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}))

type ToolChoiceListItemProps = {
  icon: ReactNode
  title: string
  description: string
  actionLabel: string
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const ToolChoiceListItem = ({
  icon,
  title,
  description,
  to,
  onClick,
  actionLabel,
}: ToolChoiceListItemProps): ReactElement => {
  const theme = useTheme()
  const content = (
    <>
      <ListItemAvatar sx={{ alignSelf: 'start', paddingTop: 0.5 }}>
        <Avatar
          sx={{
            backgroundColor: theme.palette.background.accent,
            color: theme.palette.tertiary.main,
            height: 48,
            width: 48,
          }}>
          {icon}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant='subtitle2'>{title}</Typography>}
        secondary={
          <Stack sx={{ gap: 1 }}>
            <Typography variant='body3' component='div'>
              {description}
            </Typography>
            <Stack direction='row' sx={{ textAlign: 'center', gap: 1 }}>
              <Typography variant='subtitle2' color='primary'>
                {actionLabel}
              </Typography>
              <ArrowForward fontSize='small' color='primary' />
            </Stack>
          </Stack>
        }
        sx={{ display: 'flex', flexDirection: 'column', margin: 0, gap: 1 }}
      />
    </>
  )

  return (
    <StyledListItem disablePadding>
      {to ? (
        <ListItemButton component={Link} to={to} sx={{ gap: 1 }}>
          {content}
        </ListItemButton>
      ) : (
        <ListItemButton onClick={onClick} sx={{ gap: 1 }}>
          {content}
        </ListItemButton>
      )}
    </StyledListItem>
  )
}

type ToolChoicePopupProps = {
  anchorEl: HTMLElement | null
  close: () => void
}

const ToolChoicePopup = ({ anchorEl, close }: ToolChoicePopupProps): ReactElement => {
  const [, setChatOpen] = useQueryParam(CHAT_QUERY_KEY)
  const { regionCode } = useParams()
  const { contentDirection } = useTheme()
  const { t } = useTranslation()

  const chatName = getChatName(buildConfig().appName)
  const horizontal = contentDirection === 'rtl' ? 'left' : 'right'

  return (
    <StyledPopover
      open={anchorEl !== null}
      anchorEl={anchorEl}
      onClose={close}
      anchorOrigin={{ vertical: -16, horizontal }}
      transformOrigin={{ vertical: 'bottom', horizontal }}>
      <DialogHeader
        title={buildConfig().appName.toUpperCase()}
        subtitle={t($ => $.common.labels.assistant.title)}
        icon={<ChatLogoAvatar size={32} />}
        close={close}
        desktop
        compact
      />
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant='body2'>{t($ => $.common.labels.assistant.description)}</Typography>
        <StyledList disablePadding>
          <ToolChoiceListItem
            icon={<ChatIcon />}
            title={t($ => $.chat.askQuestion)}
            description={t($ => $.chat.description)}
            actionLabel={t($ => $.chat.askChat, { name: chatName })}
            onClick={() => {
              close()
              setChatOpen(true)
            }}
          />
          <ToolChoiceListItem
            icon={<DocumentScannerIcon />}
            title={t($ => $.bescheidCheck.shortDescription)}
            description={t($ => $.bescheidCheck.description)}
            actionLabel={t($ => $.common.actions.openName, { name: bescheidCheckName })}
            to={`/${BESCHEID_CHECK_ROUTE}?${toQueryParams({ region: regionCode })}`}
          />
        </StyledList>
      </DialogContent>
    </StyledPopover>
  )
}

export default ToolChoicePopup
