import React, { KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import ChatbotConversation from './ChatbotConversation'
import ChatbotSecurityInformation from './ChatbotSecurityInformation'
import LoadingSpinner from './LoadingSpinner'
import { ChatMessageType, testSessionId } from './__mocks__/ChatMessages'
import Input from './base/Input'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

const Container = styled.div`
  min-width: 300px;
  height: 460px;

  @media ${dimensions.smallViewport} {
    height: 100%;
  }

  padding: 12px;
  display: flex;
  flex-direction: column;
`

const LoadingContainer = styled(Container)`
  justify-content: center;
`

const SubmitContainer = styled.div`
  display: flex;
`

const SubmitButton = styled(TextButton)`
  flex: 1;
`

const LoadingText = styled.div`
  text-align: center;
`

// TODO cleanup, add feature flag, only show for munich, improve sessionId handling, fix loading spinner by adding className, rename hasConversationStarted to hasOpenSession

type ChatbotProps = {
  messages: ChatMessageType[]
  updateSessionId: (newValue: number) => void
  sessionId: number
}

const Chatbot = ({ messages, updateSessionId, sessionId }: ChatbotProps): ReactElement => {
  const { t } = useTranslation('chatbot')
  const [textInput, setTextInput] = useState<string>('')
  const hasConversationStarted = messages.length > 0

  const loading = false
  const onSubmit = () => {
    setTextInput('')
    if (typeof sessionId === 'number' && sessionId) {
      return
    }
    updateSessionId(testSessionId)
  }

  const submitOnEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Einen Moment bitte, nach Ihrer Antwort wird gesucht...</LoadingText>
      </LoadingContainer>
    )
  }

  return (
    <Container>
      <ChatbotConversation hasConversationStarted={hasConversationStarted} messages={messages} />
      <InputSection id='chatbot' title={hasConversationStarted ? '' : t('inputLabel')}>
        <Input
          id='chatbot'
          value={textInput}
          onChange={setTextInput}
          multiline
          onKeyDown={submitOnEnter}
          numberOfLines={2}
          placeholder={hasConversationStarted ? undefined : t('inputPlaceholder')}
        />
      </InputSection>
      <SubmitContainer>
        <SubmitButton disabled={textInput.length === 0} onClick={onSubmit} text={t('sendButton')} />
        <ChatbotSecurityInformation />
      </SubmitContainer>
    </Container>
  )
}

export default Chatbot
