import React, { ReactElement, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ChatMessage from './ChatMessage'
import { ChatMessageType } from './__mocks__/ChatMessages'

const Container = styled.div`
  flex: 50%;
  font-size: ${props => props.theme.fonts.hintFontSize};
  overflow: auto;
`

type ChatConversationProps = {
  hasConversationStarted: boolean
  messages: ChatMessageType[]
}

const ChatConversation = ({ hasConversationStarted, messages }: ChatConversationProps): ReactElement => {
  const { t } = useTranslation('chat')
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Container>
      {hasConversationStarted ? (
        <>
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
    </Container>
  )
}

export default ChatConversation
