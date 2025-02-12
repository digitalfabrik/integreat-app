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
  const [typingIndicatorVisible, setTypingIndicatorVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isLastMessageFromUser = messages[messages.length - 1]?.userIsAuthor
  const hasOnlyReceivedInfoMessage = messages.filter(message => !message.userIsAuthor).length === 1
  const waitingForAnswer = isLastMessageFromUser || hasOnlyReceivedInfoMessage

  useEffect(() => {
    if (messagesCount < messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setMessagesCount(messages.length)
    }
  }, [messages, messagesCount])

  useEffect(() => {
    if (!waitingForAnswer) {
      return () => undefined
    }
    setTypingIndicatorVisible(true)

    const typingIndicatorTimeout = setTimeout(() => {
      setTypingIndicatorVisible(false)
    }, TYPING_INDICATOR_TIMEOUT)

    return () => clearTimeout(typingIndicatorTimeout)
  }, [waitingForAnswer])

  if (messages.length === 0) {
    return (
      <Container className={className}>
        <div>
          <b>{t('conversationTitle')}</b>
          <br />
          {t('conversationText')}
        </div>
      </Container>
    )
  }

  return (
    <Container className={className}>
      {!hasError && <InitialMessage>{t('initialMessage')}</InitialMessage>}
      {messages.map((message, index) => (
        <ChatMessage
          message={message}
          key={message.id}
          showIcon={messages[index - 1]?.userIsAuthor !== message.userIsAuthor}
        />
      ))}
      {typingIndicatorVisible && (
        <TypingIndicator>
          <strong>...</strong>
        </TypingIndicator>
      )}
      <div ref={messagesEndRef} />
      {hasError && <ErrorSendingStatus role='alert'>{t('errorMessage')}</ErrorSendingStatus>}
    </Container>
  )
}

export default ChatConversation
