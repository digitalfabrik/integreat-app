import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { parseHTML } from 'shared'
import { ChatMessageModel } from 'shared/api'

import ChatMessage from './ChatMessage'
import LiveAnnouncer from './LiveAnnouncer'
import SkeletonChatConversation from './SkeletonChatConversation'
import TypingIndicator from './TypingIndicator'

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

type ChatConversationProps = {
  retrySend: (message: ChatMessageModel) => void
  messages: ChatMessageModel[]
  botTyping: boolean
  loading?: boolean
  openUrl: ((url: string) => void) | null
}

const ChatConversation = ({
  retrySend,
  messages,
  botTyping,
  loading,
  openUrl,
}: ChatConversationProps): ReactElement => {
  const [messagesCount, setMessagesCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('chat')

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
    if (botTyping) {
      scrollToBottom()
    }
  }, [botTyping])

  const lastMessage = messages[messages.length - 1]
  const lastMessageText = lastMessage ? parseHTML(lastMessage.content, true) : ''

  if (messages.length === 0 && !loading) {
    return (
      <Stack paddingInline={3} gap={1} paddingTop={2}>
        <Typography variant='subtitle1'>{t('conversationText')}</Typography>
      </Stack>
    )
  }

  return (
    <Stack padding={2} gap={2} overflow='auto'>
      <LiveAnnouncer message={lastMessageText} />
      {loading ? (
        <SkeletonChatConversation />
      ) : (
        <>
          <StyledList disablePadding>
            {messages.map((message, index) => (
              <ChatMessage
                retrySend={retrySend}
                message={message}
                key={message.id}
                previousMessage={messages[index - 1]}
                openUrl={openUrl}
              />
            ))}
          </StyledList>
          <TypingIndicator isVisible={botTyping} />
          <div ref={messagesEndRef} />
        </>
      )}
    </Stack>
  )
}

export default ChatConversation
