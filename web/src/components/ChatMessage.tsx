import shouldForwardProp from '@emotion/is-prop-valid'
import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import { MessageAvatar } from './ChatAvatar'
import RemoteContent from './RemoteContent'

export const Message = styled('div', { shouldForwardProp })<{ userIsAuthor: boolean }>(({ theme, userIsAuthor }) => ({
  maxWidth: '70%',
  width: 'max-content',
  padding: 16,
  borderRadius: 8,
  wordBreak: 'break-word',
  backgroundColor: userIsAuthor ? theme.palette.chat.userMessageBackground : theme.palette.chat.messageBackground,
  border: `1px solid ${theme.palette.chat.messageBorderColor}`,
}))

const RetryButton = styled(IconButton)({
  height: 40,
  alignSelf: 'center',
})

type InnerChatMessageProps = {
  userIsAuthor: boolean
  showAvatar: boolean
  isAutomaticAnswer: boolean
  children: ReactElement
  hint?: ReactElement | null
}

export const InnerChatMessage = ({
  userIsAuthor,
  showAvatar,
  isAutomaticAnswer,
  children,
  hint,
}: InnerChatMessageProps): ReactElement => (
  <Stack direction={userIsAuthor ? 'row-reverse' : 'row'} gap={1}>
    <MessageAvatar userIsAuthor={userIsAuthor} isAutomaticAnswer={isAutomaticAnswer} visible={showAvatar} />
    <Message userIsAuthor={userIsAuthor}>
      <Typography variant='body2' component='div'>
        {children}
      </Typography>
    </Message>
    {hint}
  </Stack>
)

type ChatMessageProps = {
  retrySend: (message: ChatMessageModel) => void
  message: ChatMessageModel
  previousMessage: ChatMessageModel | undefined
  openUrl: ((url: string) => void) | null
}

const ChatMessage = ({ retrySend, message, previousMessage, openUrl }: ChatMessageProps): ReactElement => {
  const { t } = useTranslation('chat')

  const hasAuthorChanged = message.userIsAuthor !== previousMessage?.userIsAuthor
  const hasAutomaticAnswerChanged = message.isAutomaticAnswer !== previousMessage?.isAutomaticAnswer
  const showIcon = hasAuthorChanged || hasAutomaticAnswerChanged

  return (
    <InnerChatMessage
      userIsAuthor={message.userIsAuthor}
      showAvatar={showIcon}
      isAutomaticAnswer={message.isAutomaticAnswer}
      hint={
        !message.synced ? (
          <Tooltip title={t('error:tryAgain')}>
            <RetryButton onClick={() => retrySend(message)} aria-label={t('error:tryAgain')} color='error' size='small'>
              <RefreshIcon />
            </RetryButton>
          </Tooltip>
        ) : null
      }>
      <RemoteContent html={message.content} onLinkClick={openUrl ?? undefined} smallText />
    </InnerChatMessage>
  )
}

export default ChatMessage
