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

const TypingIndicatorWrapper = styled(Message)`
  width: max-content;
  margin-left: 33px;
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
    <TypingIndicatorWrapper>
      <strong>...</strong>
    </TypingIndicatorWrapper>
  ) : null

const TYPING_INDICATOR_TIMEOUT = 60000

const useTypingIndicator = (waitingForAnswer: boolean, ref: React.RefObject<HTMLDivElement>) => {
  const [typingIndicatorVisible, setTypingIndicatorVisible] = useState(false)

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
      ref.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [typingIndicatorVisible, ref])

  return typingIndicatorVisible
}

const ChatConversation = ({ messages, hasError, className }: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [messagesCount, setMessagesCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isLastMessageFromUser = messages[messages.length - 1]?.userIsAuthor
  const hasOnlyReceivedInfoMessage = messages.filter(message => !message.userIsAuthor).length === 1
  const waitingForAnswer = isLastMessageFromUser || hasOnlyReceivedInfoMessage
  const typingIndicatorVisible = useTypingIndicator(waitingForAnswer, messagesEndRef)

  useEffect(() => {
    if (messagesCount < messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setMessagesCount(messages.length)
    }
  }, [messages, messagesCount])

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
