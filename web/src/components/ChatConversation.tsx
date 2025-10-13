import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import ChatMessage, { InnerChatMessage } from './ChatMessage'

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

type TypingIndicatorProps = {
  isVisible: boolean
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps): ReactElement | null =>
  isVisible ? <InnerChatMessage userIsAuthor={false} showAvatar={false} isAutomaticAnswer content='...' /> : null

type ChatConversationProps = {
  messages: ChatMessageModel[]
  isTyping: boolean
}

const ChatConversation = ({ messages, isTyping }: ChatConversationProps): ReactElement => {
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

  if (messages.length === 0) {
    return (
      <Stack gap={1}>
        <Typography variant='title2'>{t('conversationTitle')}</Typography>
        <Typography variant='body2'>{t('conversationText')}</Typography>
      </Stack>
    )
  }

  return (
    <Stack padding={2} gap={2} overflow='auto'>
      {waitingForAnswer && <Typography variant='body2'>{t('initialMessage')}</Typography>}
      <StyledList disablePadding>
        {messages.map((message, index) => (
          <ChatMessage message={message} key={message.id} previousMessage={messages[index - 1]} />
        ))}
      </StyledList>
      <TypingIndicator isVisible={isTyping} />
      <div ref={messagesEndRef} />
    </Stack>
  )
}

export default ChatConversation
