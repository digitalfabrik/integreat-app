import styled from '@emotion/styled'
import React, { KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import ChatConversation from './ChatConversation'
import ChatSecurityInformation from './ChatSecurityInformation'
import LoadingSpinner from './LoadingSpinner'
import Input from './base/Input'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

const Container = styled.div`
  height: 100%;
  padding-top: 8px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media ${dimensions.mediumLargeViewport} {
    height: 600px;
    min-width: 300px;
  }
`

const LoadingContainer = styled(Container)`
  justify-content: center;
`

const SubmitContainer = styled.div`
  display: flex;
`

const SubmitButton = styled(TextButton)`
  flex: 1;
  ${helpers.adaptiveThemeTextColor}
`

const LoadingText = styled.div`
  text-align: center;
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin-top: 0;
`

const InputWrapper = styled.div`
  padding: 0 12px;
`

type ChatProps = {
  submitMessage: (text: string) => void
  messages: ChatMessageModel[]
  hasError: boolean
  isLoading: boolean
  isTyping: boolean
}

const Chat = ({ messages, submitMessage, hasError, isLoading, isTyping }: ChatProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [textInput, setTextInput] = useState<string>('')

  const onSubmit = () => {
    submitMessage(textInput)
    setTextInput('')
  }

  const submitDisabled = textInput.trim().length === 0 || hasError || isLoading
  const submitOnEnter = (event: KeyboardEvent) => {
    const isEnterAllowed = event.key === 'Enter' && !event.shiftKey && !submitDisabled
    if (isEnterAllowed) {
      event.preventDefault()
      onSubmit()
    }
  }

  if (isLoading && !hasError) {
    return (
      <LoadingContainer>
        <StyledLoadingSpinner />
        <LoadingText>{t('loadingText')}</LoadingText>
      </LoadingContainer>
    )
  }

  return (
    <Container>
      <ChatConversation messages={messages} hasError={hasError} isTyping={isTyping} />
      <InputWrapper>
        <InputSection id='chat' title={messages.length > 0 ? '' : t('inputLabel')}>
          <Input
            id='chat'
            value={textInput}
            onChange={setTextInput}
            multiline
            onKeyDown={submitOnEnter}
            numberOfLines={2}
            placeholder={t('inputPlaceholder')}
          />
        </InputSection>
        <SubmitContainer>
          <SubmitButton disabled={submitDisabled} onClick={onSubmit} text={t('sendButton')} />
          <ChatSecurityInformation />
        </SubmitContainer>
      </InputWrapper>
    </Container>
  )
}

export default Chat
