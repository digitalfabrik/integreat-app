import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ChatbotIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useLocalStorage from '../hooks/useLocalStorage'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Chatbot from './Chatbot'
import ChatbotModal from './ChatbotModal'
import ChatbotModalContent from './ChatbotModalContent'
import { ChatMessageType, mockedGetMessages } from './__mocks__/ChatMessages'
import Icon from './base/Icon'

const ChatbotButtonContainer = styled.button`
  position: fixed;
  bottom: 10%;
  right: 10%;
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: column;

  @media ${dimensions.smallViewport} {
    box-shadow: 0 2px 3px 3px rgb(0 0 0 / 30%);
    bottom: 16px;
    inset-inline-end: 16px;
    border-radius: 50%;
    padding: 0;
  }
`

const MinimizedToolbar = styled.div`
  position: fixed;
  z-index: 200;
  bottom: 0;
  right: 20px;

  @media ${dimensions.smallViewport} {
    display: none;
  }
`

const ChatIcon = styled(Icon)`
  width: 40px;
  height: 40px;
  align-self: center;

  @media ${dimensions.smallViewport} {
    width: 60px;
    height: 60px;
  }
`

const ChatTitle = styled.span`
  margin-top: 8px;
`

export enum ChatbotVisibilityStatus {
  closed,
  minimized,
  maximized,
}

const LOCAL_STORAGE_ITEM_CHAT_MESSAGES = 'ChatBot-Session'
const ChatbotContainer = (): ReactElement => {
  const { t } = useTranslation('chatbot')
  const [chatBotVisibilityStatus, setChatBotVisibilityStatus] = useState<ChatbotVisibilityStatus>(
    ChatbotVisibilityStatus.closed,
  )
  const { value: sessionId, updateLocalStorageItem } = useLocalStorage<number>(LOCAL_STORAGE_ITEM_CHAT_MESSAGES)
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const { viewportSmall } = useWindowDimensions()

  useEffect(() => {
    if (typeof sessionId === 'number' && sessionId) {
      setMessages(mockedGetMessages(sessionId))
    }
  }, [sessionId])

  return (
    <>
      {chatBotVisibilityStatus === ChatbotVisibilityStatus.maximized && (
        <ChatbotModal
          title={t('headerTitle')}
          resizeModal={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.minimized)}
          closeModal={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.closed)}
          visibilityStatus={chatBotVisibilityStatus}>
          <Chatbot messages={messages} updateSessionId={updateLocalStorageItem} sessionId={sessionId} />
        </ChatbotModal>
      )}

      {chatBotVisibilityStatus === ChatbotVisibilityStatus.minimized && (
        <MinimizedToolbar>
          <ChatbotModalContent
            title={t('headerTitle')}
            onResize={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.maximized)}
            onClose={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.closed)}
            small={false}
            visibilityStatus={chatBotVisibilityStatus}
          />
        </MinimizedToolbar>
      )}
      {chatBotVisibilityStatus === ChatbotVisibilityStatus.closed && (
        <ChatbotButtonContainer onClick={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.maximized)}>
          <ChatIcon src={ChatbotIcon} title={t('button')} />
          {!viewportSmall && <ChatTitle>{t('button')}</ChatTitle>}
        </ChatbotButtonContainer>
      )}
    </>
  )
}

export default ChatbotContainer
