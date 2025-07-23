import styled from '@emotion/styled'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import React, { KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CityModel } from 'shared/api'
import ChatMessageModel from 'shared/api/models/ChatMessageModel'

import buildConfig from '../constants/buildConfig'
import Caption from './Caption'
import ChatConversation from './ChatConversation'
import ChatPrivacyInformation from './ChatPrivacyInformation'
import LoadingSpinner from './LoadingSpinner'
import PrivacyCheckbox from './PrivacyCheckbox'
import Input from './base/Input'
import InputSection from './base/InputSection'

const Container = styled.div`
  height: 100%;
  padding: 12px 0;
  gap: ${props => props.theme.spacing(1)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${props => props.theme.breakpoints.up('md')} {
    height: 600px;
    min-width: 300px;
  }
`

const LoadingContainer = styled(Container)`
  justify-content: center;
`

const SubmitContainer = styled.div`
  gap: ${props => props.theme.spacing(1)};
  display: flex;
`

const SubmitButton = styled(Button)`
  flex: 1;
`

const LoadingText = styled.div`
  text-align: center;
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin-top: 0;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  gap: ${props => props.theme.spacing(1)};
`

type ChatProps = {
  city: CityModel
  submitMessage: (text: string) => void
  messages: ChatMessageModel[]
  hasError: boolean
  isLoading: boolean
  isTyping: boolean
  privacyPolicyAccepted: boolean
  acceptPrivacyPolicy: () => void
  languageCode: string
}

const Chat = ({
  city,
  messages,
  submitMessage,
  hasError,
  isLoading,
  isTyping,
  privacyPolicyAccepted,
  acceptPrivacyPolicy,
  languageCode,
}: ChatProps): ReactElement => {
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

  if (!privacyPolicyAccepted) {
    return (
      <Container>
        <InputWrapper>
          <Caption title={t('settings:privacyPolicy')} />
          {t('privacyPolicyInformation', { city: city.name, appName: buildConfig().appName })}
          <PrivacyCheckbox
            language={languageCode}
            checked={false}
            setChecked={acceptPrivacyPolicy}
            url={city.chatPrivacyPolicyUrl}
          />
        </InputWrapper>
      </Container>
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
            onKeyDown={submitOnEnter}
            rows={2}
            placeholder={t('chatInputHelperText')}
          />
        </InputSection>
        <SubmitContainer>
          <SubmitButton onClick={onSubmit} startIcon={<SendIcon />} variant='contained' disabled={submitDisabled}>
            {t('sendButton')}
          </SubmitButton>
          <ChatPrivacyInformation customPrivacyUrl={city.chatPrivacyPolicyUrl} />
        </SubmitContainer>
      </InputWrapper>
    </Container>
  )
}

export default Chat
