import React, { KeyboardEvent, ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { createChatSessionEndpoint, createChatMessageEndpoint, useLoadFromEndpoint } from 'shared/api'

import dimensions from '../constants/dimensions'
import { cmsApiBaseUrl } from '../constants/urls'
import useLocalStorage from '../hooks/useLocalStorage'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ChatConversation from './ChatConversation'
import ChatSecurityInformation from './ChatSecurityInformation'
import { SendingStatusType } from './FeedbackContainer'
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
  city: string
  language: string
  generatedDeviceId: string
}

const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Device-Id'
const POLLING_INTERVAL = 16000
const Chat = ({ city, language, generatedDeviceId }: ChatProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [textInput, setTextInput] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const { value: storedDeviceId, updateLocalStorageItem: setDeviceId } = useLocalStorage<string>(
    LOCAL_STORAGE_ITEM_CHAT_MESSAGES,
  )
  // 2833 TODO Improve useLocalStorage hook with a default/init method
  const hasOpenChatSession = !!(typeof storedDeviceId === 'string' && storedDeviceId)
  const deviceId = hasOpenChatSession ? storedDeviceId : generatedDeviceId
  const {
    data: chatMessages,
    refresh: refreshMessages,
    error,
  } = useLoadFromEndpoint(createChatMessageEndpoint, cmsApiBaseUrl, { city, language, deviceId }, !hasOpenChatSession)
  const hasChatMessages = chatMessages !== null && chatMessages.length > 0
  const { height: deviceHeight } = useWindowDimensions()

  useEffect(() => {
    if (!hasOpenChatSession) {
      return undefined
    }
    const pollMessageInterval = setInterval(refreshMessages, POLLING_INTERVAL)
    return () => clearInterval(pollMessageInterval)
  }, [hasOpenChatSession, refreshMessages])

  const onSubmit = async () => {
    setSendingStatus('sending')
    setTextInput('')
    const { data, error } = await createChatSessionEndpoint(cmsApiBaseUrl).request({
      city,
      language,
      message: textInput,
      deviceId,
    })

    if (data !== null) {
      setSendingStatus('successful')
      if (!hasOpenChatSession) {
        setDeviceId(generatedDeviceId)
      }
      refreshMessages()
    }

    if (error !== null) {
      setSendingStatus('failed')
    }
  }

  const submitOnEnter = async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await onSubmit()
    }
  }

  if (sendingStatus === 'sending' && !hasOpenChatSession) {
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
        hasConversationStarted={hasOpenChatSession}
        messages={hasChatMessages ? chatMessages : []}
        showError={!!(sendingStatus === 'failed' || error)}
      />
      <InputWrapper>
        <InputSection id='chat' title={hasChatMessages ? '' : t('inputLabel')}>
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
