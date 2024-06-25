import React, { ReactElement, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import ChatMessage from './ChatMessage'

const Container = styled.div`
  font-size: ${props => props.theme.fonts.hintFontSize};
  overflow: auto;
`

const InitialMessage = styled.div`
  margin-bottom: 12px;
`

const ErrorSendingStatus = styled.div`
  background-color: ${props => props.theme.colors.invalidInput};
  border-radius: 5px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.textDecorationColor};
  margin: 16px;
`

type ChatConversationProps = {
  hasConversationStarted: boolean
  messages: ChatMessageModel[]
  hasError: boolean
  className?: string
}

const ChatConversation = ({
  hasConversationStarted,
  messages,
  hasError,
  className,
}: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Container className={className}>
      {hasConversationStarted ? (
        <>
          {!hasError && <InitialMessage>{t('initialMessage')}</InitialMessage>}
          {messages.map((message, index) => (
            <ChatMessage
              message={message}
              key={message.id}
              showIcon={messages[index - 1]?.userIsAuthor !== message.userIsAuthor}
            />
          ))}
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
