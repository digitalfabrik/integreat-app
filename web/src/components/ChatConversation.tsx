import React, { ReactElement, useEffect, useRef, useState } from 'react'
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

const TypingIndicator = styled.div`
  text-align: center;
  border-radius: 5px;
  padding: 8px;
  width: 20px;
  border: 1px solid ${props => props.theme.colors.textDecorationColor};
  font-size: ${props => props.theme.fonts.contentFontSize};
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

const TIMEOUT = 60000

const ChatConversation = ({ messages, hasError, className }: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [messagesCount, setMessagesCount] = useState(0)
  const [showTypingIndicator, setShowTypingIndicator] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMessage = messages[messages.length - 1]

  useEffect(() => {
    if (messagesCount < messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setMessagesCount(messages.length)
    }
  }, [messages, messagesCount])

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!lastMessage?.userIsAuthor && lastMessage?.isAutomaticAnswer) {
      setShowTypingIndicator(true)

      const hideIndicatorTimer = setTimeout(() => {
        setShowTypingIndicator(false)
      }, TIMEOUT)

      return () => clearTimeout(hideIndicatorTimer)
    }
  }, [lastMessage?.id, lastMessage?.isAutomaticAnswer, lastMessage?.userIsAuthor])

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
