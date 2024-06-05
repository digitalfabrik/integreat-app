import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { DataSecurityIcon } from '../assets'
import Icon from './base/Icon'
import Input from './base/Input'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

const Container = styled.div`
  min-width: 300px;
  height: 350px;
  padding: 12px;
`

const ConversationContainer = styled.div`
  height: 50%;
  font-size: ${props => props.theme.fonts.hintFontSize};
`

const StyledInputSection = styled(InputSection)`
  height: 50%;
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

const onSubmit = () => console.log('Senden')
const Chatbot = (): ReactElement => {
  const [textInput, setTextInput] = useState<string>('')
  return (
    <Container>
      <ConversationContainer>Conversation Content</ConversationContainer>
      <StyledInputSection id='chatbot' title='Meine Frage:'>
        <Input
          id='chatbot'
          value={textInput}
          onChange={setTextInput}
          multiline
          numberOfLines={3}
          placeholder='Ich möchte wissen....'
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
