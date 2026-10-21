import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import Badge from '@mui/material/Badge'
import Fab from '@mui/material/Fab'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CHAT_QUERY_KEY, getChatName } from 'shared'

import buildConfig from '../constants/buildConfig'
import { CHAT_FAB_ELEMENT_ID } from '../constants/layout'
import { useScrollDimensions } from '../hooks/useDimensions'
import useQueryParam from '../hooks/useQueryParam'
import ChatHighlightPopup from './ChatHighlightPopup'
import LiveAnnouncer from './LiveAnnouncer'

const ChatButtonContainer = styled(Stack)<{ bottom: number }>(({ theme, bottom }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.fab,
  bottom,
  insetInlineEnd: 16,
  marginBottom: 16,
  alignItems: 'center',
  width: 'min-content',
  gap: 8,
}))

type ChatButtonProps = {
  unreadMessageCount: number
}

const ChatFab = ({ unreadMessageCount }: ChatButtonProps): ReactElement | null => {
  const [open, setOpen] = useQueryParam(CHAT_QUERY_KEY)
  const { desktop, visibleFooterHeight, bottomNavigationHeight } = useScrollDimensions()
  const { t } = useTranslation()

  const chatName = getChatName(buildConfig().appName)
  const unreadMessages = t($ => $.chat.unread, { count: unreadMessageCount })
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  if (open) {
    return null
  }

  return (
    <ChatButtonContainer id={CHAT_FAB_ELEMENT_ID} bottom={bottomNavigationHeight ?? visibleFooterHeight}>
      <LiveAnnouncer message={unreadMessageCount > 0 ? unreadMessages : ''} />
      <Badge
        badgeContent={unreadMessageCount > 0 ? unreadMessageCount : undefined}
        color='error'
        aria-label={unreadMessages}>
        <Fab ref={setAnchorEl} onClick={() => setOpen(true)} color='primary' aria-label={chatName}>
          <QuestionAnswerOutlinedIcon fontSize='large' />
        </Fab>
      </Badge>
      <ChatHighlightPopup anchorEl={anchorEl} chatName={chatName} />
      {desktop && (
        <Typography aria-hidden sx={{ textAlign: 'center' }}>
          {chatName}
        </Typography>
      )}
    </ChatButtonContainer>
  )
}

export default ChatFab
