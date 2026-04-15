import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import ChatMessage from './ChatMessage'
import SkeletonChatConversation from './SkeletonChatConversation'
import TypingIndicator from './TypingIndicator'

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

type ChatConversationProps = {
  messages: ChatMessageModel[]
  isTyping: boolean
  loading?: boolean
}

const ChatConversation = ({ messages, isTyping, loading }: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [messagesCount, setMessagesCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      </Stack>
    )
  }

  return (
    <Stack padding={2} gap={2} overflow='auto'>
      {loading ? (
        <SkeletonChatConversation />
      ) : (
        <>
          <StyledList disablePadding aria-relevant='additions'>
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
