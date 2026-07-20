import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import Badge from '@mui/material/Badge'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getChatName } from 'shared'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import ChatHighlightPopup from './ChatHighlightPopup'
import LiveAnnouncer from './LiveAnnouncer'

const ChatButtonContainer = styled('div')<{ bottom: number }>`
  position: fixed;
  z-index: ${props => props.theme.zIndex.fab};
  bottom: ${props => props.bottom}px;
  inset-inline-end: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;
  gap: 8px;
`

type ChatButtonProps = {
  onClick: () => void
  unreadMessageCount: number
}

const ChatFab = ({ onClick, unreadMessageCount }: ChatButtonProps): ReactElement => {
  const { desktop, visibleFooterHeight, bottomNavigationHeight } = useDimensions()
  const { t } = useTranslation('chat')

  const chatName = getChatName(buildConfig().appName)
  const unreadMessages = t('unreadMessages', { count: unreadMessageCount })
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  return (
    <ChatButtonContainer bottom={bottomNavigationHeight ?? visibleFooterHeight}>
      <LiveAnnouncer message={unreadMessageCount > 0 ? unreadMessages : ''} />
      <Badge
        badgeContent={unreadMessageCount > 0 ? unreadMessageCount : undefined}
        color='error'
        aria-label={unreadMessages}>
        <Fab ref={setAnchorEl} onClick={onClick} color='primary' aria-label={chatName}>
          <QuestionAnswerOutlinedIcon fontSize='large' />
        </Fab>
      </Badge>
      <ChatHighlightPopup anchorEl={anchorEl} chatName={chatName} />
      {desktop && (
        <Typography textAlign='center' aria-hidden>
          {chatName}
        </Typography>
      )}
    </ChatButtonContainer>
  )
}

export default ChatFab
