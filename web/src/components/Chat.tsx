import React, { KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ChatConversation from './ChatConversation'
import ChatSecurityInformation from './ChatSecurityInformation'
import LoadingSpinner from './LoadingSpinner'
import Input from './base/Input'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

const Container = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;

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
`

const LoadingText = styled.div`
  text-align: center;
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin-top: 0;
`

const InputWrapper = styled.div`
  height: ${dimensions.chatInputContainerHeight}px;
  padding-top: 12px;
`

const StyledChatConversion = styled(ChatConversation)<{ $height: number }>`
  height: ${props => props.$height}px;
`

type ChatProps = {
  submitMessage: (text: string, deviceId?: string, refreshMessages?: () => void) => void
  messages: ChatMessageModel[]
  deviceId?: string
  hasError: boolean
  isLoading: boolean
  refreshMessages?: () => void
}

const Chat = ({ messages, submitMessage, deviceId, hasError, isLoading, refreshMessages }: ChatProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [textInput, setTextInput] = useState<string>('')

  const { height: deviceHeight } = useWindowDimensions()

  const onSubmit = () => {
    submitMessage(textInput, deviceId, refreshMessages)
    setTextInput('')
  }

  const submitOnEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
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
      <StyledChatConversion
        $height={deviceHeight - dimensions.chatInputContainerHeight}
        hasConversationStarted={!!deviceId}
        messages={messages}
        hasError={hasError}
      />
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
          <SubmitButton disabled={textInput.length === 0} onClick={onSubmit} text={t('sendButton')} />
          <ChatSecurityInformation />
        </SubmitContainer>
      </InputWrapper>
    </Container>
  )
}

export default Chat
