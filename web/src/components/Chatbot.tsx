import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { DataSecurityIcon } from '../assets'
import ChatbotConversation from './ChatbotConversation'
import LoadingSpinner from './LoadingSpinner'
import Icon from './base/Icon'
import Input from './base/Input'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

const Container = styled.div`
  min-width: 300px;
  height: 400px;
  padding: 12px;
  display: flex;
  flex-direction: column;
`

const LoadingContainer = styled(Container)`
  justify-content: center;
`

const StyledInputSection = styled(InputSection)`
  // height: 50%;
`

const StyledIconContainer = styled.div`
  height: 24px;
  width: 24px;
  align-self: center;
  padding: 8px;
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

// TODO security info container, scrollToBottom on chat messages, fix external link styling, submit on enter, fix minimize issue -> Text gone

const Chatbot = (): ReactElement => {
  const [textInput, setTextInput] = useState<string>('')
  const [hasConversationStated, setHasConversationStated] = useState<boolean>(false)
  const loading = false
  const onSubmit = () => {
    setHasConversationStated(true)
    setTextInput('')
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
      <ChatbotConversation hasConversationStarted={hasConversationStated} />
      <StyledInputSection id='chatbot' title={hasConversationStated ? '' : 'Meine Frage:'}>
        <Input
          id='chatbot'
          value={textInput}
          onChange={setTextInput}
          multiline
          numberOfLines={hasConversationStated ? 1 : 3}
          placeholder={hasConversationStated ? undefined : 'Ich möchte wissen....'}
        />
      </StyledInputSection>
      <SubmitContainer>
        <SubmitButton disabled={textInput.length === 0} onClick={onSubmit} text='Senden' />
        <StyledIconContainer>
          <Icon src={DataSecurityIcon} />
        </StyledIconContainer>
      </SubmitContainer>
    </Container>
  )
}

export default Chatbot
