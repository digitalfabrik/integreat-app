import React, { KeyboardEvent, ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { createChatGetEndpoint, createChatPostEndpoint, useLoadFromEndpoint } from 'shared/api'

import dimensions from '../constants/dimensions'
import { cmsApiBaseUrl } from '../constants/urls'
import { reportError } from '../utils/sentry'
import ChatConversation from './ChatConversation'
import ChatSecurityInformation from './ChatSecurityInformation'
import FailureSwitcher from './FailureSwitcher'
import { SendingStatusType } from './FeedbackContainer'
import LoadingSpinner from './LoadingSpinner'
import Input from './base/Input'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

const Container = styled.div`
  min-width: 300px;
  height: 460px;
  padding: 12px;
  display: flex;
  flex-direction: column;

  @media ${dimensions.smallViewport} {
    height: 100%;
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

type ChatProps = {
  city: string
  language: string
  deviceId: string
}

// TODO add error handling

const POLLING_INTERVAL = 30000
const Chat = ({ city, language, deviceId }: ChatProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [textInput, setTextInput] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const {
    data: chatMessages,
    refresh: refreshMessages,
    error,
  } = useLoadFromEndpoint(createChatGetEndpoint, cmsApiBaseUrl, { city, language, deviceId })

  useEffect(() => {
    const pollChatMessages = setTimeout(refreshMessages, POLLING_INTERVAL)
    return () => clearTimeout(pollChatMessages)
  })

  const onSubmit = () => {
    if (!deviceId) {
      return
    }
    setSendingStatus('sending')
    const request = async () => {
      const chatEndpoint = createChatPostEndpoint(cmsApiBaseUrl)
      await chatEndpoint.request({
        city,
        language,
        message: textInput,
        deviceId,
      })
      refreshMessages()
    }
    setSendingStatus('successful')
    setTextInput('')

    request().catch(err => {
      reportError(err)
      setSendingStatus('failed')
    })
  }

  const submitOnEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  if (sendingStatus === 'sending') {
    return (
      <LoadingContainer>
        <StyledLoadingSpinner />
        <LoadingText>{t('loadingText')}</LoadingText>
      </LoadingContainer>
    )
  }

  if (error) {
    return <FailureSwitcher error={error} />
  }

  return (
    <Container>
      <ChatConversation
        hasConversationStarted={chatMessages !== null && chatMessages.length > 0}
        messages={chatMessages ?? []}
      />
      <InputSection id='chat' title={chatMessages !== null && chatMessages.length > 0 ? '' : t('inputLabel')}>
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
    </Container>
  )
}

export default Chat
