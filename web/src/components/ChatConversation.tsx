import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import ChatMessage, { Message } from './ChatMessage'

const Container = styled.div`
  font-size: ${props => props.theme.fonts.hintFontSize};
  overflow: auto;
`

const InitialMessage = styled.div`
  margin-bottom: 12px;
`

const TypingIndicator = styled(Message)`
  width: max-content;
`

const ErrorSendingStatus = styled.div`
  background-color: ${props => props.theme.colors.invalidInput};
  border-radius: 5px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.textDecorationColor};
  margin: 16px;
`

type ChatConversationProps = {
  messages: ChatMessageModel[]
  hasError: boolean
  className?: string
}

const TYPING_INDICATOR_TIMEOUT = 60000

const ChatConversation = ({ messages, hasError, className }: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [messagesCount, setMessagesCount] = useState(0)
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastUserMessage = messages[messages.length - 1]
  const beforelastUserMessage = messages[messages.length - 2]

  useEffect(() => {
    if (messagesCount < messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setMessagesCount(messages.length)
    }
  }, [messages, messagesCount])

  useEffect(() => {
    if (lastUserMessage?.userIsAuthor || beforelastUserMessage?.userIsAuthor) {
      setShowTypingIndicator(true)

      const typingIndicatorTimeout = setTimeout(() => {
        setShowTypingIndicator(false)
      }, TYPING_INDICATOR_TIMEOUT)

      return () => clearTimeout(typingIndicatorTimeout)
    }
    return () => undefined
  }, [lastUserMessage?.userIsAuthor, beforelastUserMessage?.userIsAuthor])

  return (
    <Container className={className}>
      {messages.length > 0 ? (
        <>
          {!hasError && <InitialMessage>{t('initialMessage')}</InitialMessage>}
          {messages.map((message, index) => (
            <ChatMessage
              message={message}
              key={message.id}
              showIcon={messages[index - 1]?.userIsAuthor !== message.userIsAuthor}
            />
          ))}
          {showTypingIndicator && (
            <TypingIndicator>
              <strong>...</strong>
            </TypingIndicator>
          )}
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
