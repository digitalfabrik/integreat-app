import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import ChatMessage, { InnerChatMessage } from './ChatMessage'

const Container = styled.div`
  font-size: ${props => props.theme.fonts.hintFontSize};
  overflow: auto;
`
const TypingIndicatorContainer = styled.div`
  width: max-content;
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
  messages: ChatMessageModel[]
  hasError: boolean
  className?: string
}

type TypingIndicatorProps = {
  isVisible: boolean
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps): ReactElement | null =>
  isVisible ? (
    <TypingIndicatorContainer>
      <InnerChatMessage userIsAuthor={false} showIcon={false} isAutomaticAnswer body='...' messageId={0} />
    </TypingIndicatorContainer>
  ) : null

const TYPING_INDICATOR_TIMEOUT = 60000

const ChatConversation = ({ messages, hasError, className }: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [messagesCount, setMessagesCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isLastMessageFromUser = messages[messages.length - 1]?.userIsAuthor
  const hasOnlyReceivedInfoMessage = messages.filter(message => !message.userIsAuthor).length === 1
  const waitingForAnswer = isLastMessageFromUser || hasOnlyReceivedInfoMessage
  const [typingIndicatorVisible, setTypingIndicatorVisible] = useState(false)

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
    if (waitingForAnswer) {
      setTypingIndicatorVisible(true)
      const timeout = setTimeout(() => setTypingIndicatorVisible(false), TYPING_INDICATOR_TIMEOUT)
      return () => clearTimeout(timeout)
    }
    setTypingIndicatorVisible(false)
    return undefined
  }, [waitingForAnswer])

  useEffect(() => {
    if (typingIndicatorVisible) {
      scrollToBottom()
    }
  }, [typingIndicatorVisible])

  return (
    <Container className={className}>
      {messages.length > 0 ? (
        <>
          {!hasError && <InitialMessage>{t('initialMessage')}</InitialMessage>}
          {messages.map((message, index) => (
            <ChatMessage message={message} key={message.id} previousMessage={messages[index - 1]} />
          ))}
          <TypingIndicator isVisible={typingIndicatorVisible} />
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
