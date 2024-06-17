import React, { KeyboardEvent, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import useLocalStorage from '../hooks/useLocalStorage'
import ChatConversation from './ChatConversation'
import ChatSecurityInformation from './ChatSecurityInformation'
import LoadingSpinner from './LoadingSpinner'
import { ChatMessageType, mockedGetMessages, testSessionId } from './__mocks__/ChatMessages'
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

const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'Chat-Session'

const Chat = (): ReactElement => {
  const { t } = useTranslation('chat')
  const [textInput, setTextInput] = useState<string>('')
  const { value: sessionId, updateLocalStorageItem: setSessionId } = useLocalStorage<number>(
    LOCAL_STORAGE_ITEM_CHAT_MESSAGES,
  )
  // 2833 TODO Improve useLocalStorage hook with a default/init method
  const hasSessionId = !!(typeof sessionId === 'number' && sessionId)
  // TODO 2799 Implement Chat API
  const [messages, setMessages] = useState<ChatMessageType[]>(hasSessionId ? mockedGetMessages(sessionId) : [])

  const loading = false
  const onSubmit = () => {
    setTextInput('')
    // TODO 2799 Implement Chat API - get messages and set correct sessionId
    setMessages(mockedGetMessages(sessionId))
    if (hasSessionId) {
      return
    }
    setSessionId(testSessionId)
  }

  const submitOnEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }
  // loading will be provided by api
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (loading) {
    return (
      <LoadingContainer>
        <StyledLoadingSpinner />
        <LoadingText>{t('loadingText')}</LoadingText>
      </LoadingContainer>
    )
  }

  return (
    <Container>
      <ChatConversation hasConversationStarted={hasSessionId} messages={messages} />
      <InputSection id='chat' title={hasSessionId ? '' : t('inputLabel')}>
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
