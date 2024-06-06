import React, { ReactElement } from 'react'
import styled from 'styled-components'

import ChatMessage from './ChatMessage'
import { testMessages } from './__mocks__/ChatMessages'

const Container = styled.div`
  flex: 50%;
  font-size: ${props => props.theme.fonts.hintFontSize};
  overflow: auto;
`

type ChatbotConversationProps = {
  hasConversationStarted: boolean
}

const ChatbotConversation = ({ hasConversationStarted }: ChatbotConversationProps): ReactElement => {
  return (
    <Container>
      {hasConversationStarted ? (
        <div>
          {testMessages.map((message, index) => (
            <ChatMessage
              message={message}
              key={message.id}
              showIcon={testMessages[index - 1]?.userIsAuthor !== message.userIsAuthor}
            />
          ))}
        </div>
      ) : (
        <div>
          Bitte geben Sie Ihre Frage in das Textfeld ein. Sie können alles fragen, von lokalen Informationen bis hin zu
          spezifischen Anfragen bezüglich Ihrer Situation. Mehr lesen...
        </div>
      )}
    </Container>
  )
}

export default ChatbotConversation
