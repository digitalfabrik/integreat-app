import shouldForwardProp from '@emotion/is-prop-valid'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import RemoteContent from './RemoteContent'

export const Message = styled('div')(({ theme }) => ({
  maxWidth: '70%',
  width: 'max-content',
  padding: 8,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  wordBreak: 'break-word',
}))

const StyledAvatar = styled(Avatar, { shouldForwardProp })<{ visible: boolean }>(({ visible }) => ({
  opacity: visible ? 1 : 0,
}))

type MessageAvatarProps = {
  userIsAuthor: boolean
  isAutomaticAnswer: boolean
  visible: boolean
}

const MessageAvatar = ({ userIsAuthor, isAutomaticAnswer, visible }: MessageAvatarProps): ReactElement => {
  const { t } = useTranslation('chat')
  if (userIsAuthor) {
    return <StyledAvatar visible={visible} aria-label={t('user')} />
  }
  return (
    <StyledAvatar visible={visible} aria-label={t(isAutomaticAnswer ? 'bot' : 'human')}>
      {isAutomaticAnswer ? <SmartToyOutlinedIcon /> : <PersonOutlinedIcon />}
    </StyledAvatar>
  )
}

type InnerChatMessageProps = {
  userIsAuthor: boolean
  showAvatar: boolean
  isAutomaticAnswer: boolean
  content: string
}

export const InnerChatMessage = ({
  userIsAuthor,
  showAvatar,
  isAutomaticAnswer,
  content,
}: InnerChatMessageProps): ReactElement => (
  <Stack direction={userIsAuthor ? 'row-reverse' : 'row'} gap={1}>
    <MessageAvatar userIsAuthor={userIsAuthor} isAutomaticAnswer={isAutomaticAnswer} visible={showAvatar} />
    <Message>
      <Typography variant='body2' component='div'>
        <RemoteContent html={content} smallText />
      </Typography>
    </Message>
  </Stack>
)

type ChatMessageProps = {
  message: ChatMessageModel
  previousMessage: ChatMessageModel | undefined
}

const ChatMessage = ({ message, previousMessage }: ChatMessageProps): ReactElement => {
  const { content, userIsAuthor, isAutomaticAnswer } = message
  const hasAuthorChanged = message.userIsAuthor !== previousMessage?.userIsAuthor
  const hasAutomaticAnswerChanged = message.isAutomaticAnswer !== previousMessage?.isAutomaticAnswer
  const showIcon = hasAuthorChanged || hasAutomaticAnswerChanged

  return (
    <InnerChatMessage
      userIsAuthor={userIsAuthor}
      showAvatar={showIcon}
      isAutomaticAnswer={isAutomaticAnswer}
      content={content}
    />
  )
}

export default ChatMessage
