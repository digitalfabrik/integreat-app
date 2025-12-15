import InfoOutlineIcon from '@mui/icons-material/InfoOutline'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import ChatMessage, { InnerChatMessage } from './ChatMessage'
import SkeletonChatConversation from './SkeletonChatConversation'

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

const StyledDiv = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.palette.text.secondary};
`

type TypingIndicatorProps = {
  isVisible: boolean
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps): ReactElement | null =>
  isVisible ? <InnerChatMessage userIsAuthor={false} showAvatar={false} isAutomaticAnswer content='...' /> : null

type ChatConversationProps = {
  messages: ChatMessageModel[]
  isTyping: boolean
  loading?: boolean
}

const ChatConversation = ({ messages, isTyping, loading }: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [messagesCount, setMessagesCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const waitingForAnswer = messages.every(message => message.userIsAuthor)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (messagesCount < messages.length) {
      scrollToBottom()
      setMessagesCount(messages.length)
    }
  }, [messages, messagesCount])

  useEffect(() => {
    if (isTyping) {
      scrollToBottom()
    }
  }, [isTyping])

  if (messages.length === 0 && !loading) {
    return (
      <Stack paddingInline={3} gap={1}>
        <Typography variant='subtitle1'>{t('conversationText')}</Typography>
        <StyledDiv>
          <InfoOutlineIcon fontSize='small' />
          <Typography variant='body2'>{t('conversationHelperText')}</Typography>
        </StyledDiv>
      </Stack>
    )
  }

  return (
    <Stack padding={2} gap={2} overflow='auto'>
      {loading ? (
        <SkeletonChatConversation />
      ) : (
        <>
          {waitingForAnswer && <Typography variant='body2'>{t('initialMessage')}</Typography>}
          <StyledList disablePadding>
            {messages.map((message, index) => (
              <ChatMessage message={message} key={message.id} previousMessage={messages[index - 1]} />
            ))}
          </StyledList>
          <TypingIndicator isVisible={isTyping} />
          <div ref={messagesEndRef} />
        </>
      )}
    </Stack>
  )
}

export default ChatConversation
