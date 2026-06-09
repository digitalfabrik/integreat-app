import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import Badge from '@mui/material/Badge'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { getChatName } from 'shared'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'

const ChatButtonContainer = styled('div')<{ bottom: number }>`
  position: fixed;
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
  unreadMessageCount?: number
}

const ChatFab = ({ onClick, unreadMessageCount = 0 }: ChatButtonProps): ReactElement => {
  const { desktop, visibleFooterHeight, bottomNavigationHeight } = useDimensions()
  const chatName = getChatName(buildConfig().appName)

  return (
    <ChatButtonContainer bottom={bottomNavigationHeight ?? visibleFooterHeight}>
      <Badge badgeContent={unreadMessageCount > 0 ? unreadMessageCount : undefined} color='error'>
        <Fab onClick={onClick} color='primary' aria-label={chatName}>
          <QuestionAnswerOutlinedIcon fontSize='large' />
        </Fab>
      </Badge>
      {desktop && (
        <Typography textAlign='center' aria-hidden>
          {chatName}
        </Typography>
      )}
    </ChatButtonContainer>
  )
}

export default ChatFab
