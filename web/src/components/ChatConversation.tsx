import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ChatMessageModel } from 'shared/api'

import ChatMessage, { InnerChatMessage } from './ChatMessage'

const Container = styled('div')`
  font-size: ${props => props.theme.legacy.fonts.hintFontSize};
  overflow: auto;
  padding: 0 12px;
`

const InitialMessage = styled('div')`
  margin-bottom: 12px;
`

const ErrorSendingStatus = styled('div')`
  background-color: ${props => props.theme.legacy.colors.invalidInput};
  border-radius: 5px;
  padding: 8px;
  border: 1px solid ${props => props.theme.legacy.colors.textDecorationColor};
  margin: 16px;
`

type ChatConversationProps = {
  messages: ChatMessageModel[]
  hasError: boolean
  className?: string
  isTyping: boolean
}

type TypingIndicatorProps = {
  isVisible: boolean
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps): ReactElement | null =>
  isVisible ? (
    <InnerChatMessage userIsAuthor={false} showIcon={false} isAutomaticAnswer content='...' messageId={0} />
  ) : null

const ChatConversation = ({ messages, hasError, className, isTyping }: ChatConversationProps): ReactElement => {
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

  return (
    <Container className={className}>
      {waitingForAnswer && !hasError && <InitialMessage>{t('initialMessage')}</InitialMessage>}
      {messages.length > 0 ? (
        <>
          {messages.map((message, index) => (
            <ChatMessage message={message} key={message.id} previousMessage={messages[index - 1]} />
          ))}
          <TypingIndicator isVisible={isTyping} />
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div>
          <b>{t('conversationTitle')}</b>
          <br />
          {t('conversationText')}
        </div>
      )}
      {hasError && <ErrorSendingStatus role='alert'>{t('errorMessage')}</ErrorSendingStatus>}
    </Container>
  )
}

export default ChatConversation
