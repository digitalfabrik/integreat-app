import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ChatbotIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Chatbot from './Chatbot'
import ChatbotContentWrapper from './ChatbotContentWrapper'
import ChatbotModal from './ChatbotModal'
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
    bottom: 12px;
    inset-inline-end: 12px;
  }
`

const Circle = styled.div`
  background-color: ${props => props.theme.colors.themeColor};
  border-radius: 50%;
  box-shadow: 0 2px 3px 3px rgb(0 0 0 / 20%);
  align-self: center;
  padding: 8px;
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
  display: flex;
  width: 24px;
  height: 24px;
  align-self: center;
  justify-content: center;

  @media ${dimensions.smallViewport} {
    width: 40px;
    height: 40px;
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

const ChatbotContainer = (): ReactElement => {
  const { t } = useTranslation('chatbot')
  const [chatBotVisibilityStatus, setChatBotVisibilityStatus] = useState<ChatbotVisibilityStatus>(
    ChatbotVisibilityStatus.closed,
  )
  const { viewportSmall } = useWindowDimensions()
  const isChatMaximized = chatBotVisibilityStatus === ChatbotVisibilityStatus.maximized
  useLockedBody(isChatMaximized)
  const headerTitle = t('headerTitle', { appName: buildConfig().appName })

  return (
    <>
      {isChatMaximized && (
        <ChatbotModal
          title={headerTitle}
          resizeModal={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.minimized)}
          closeModal={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.closed)}
          visibilityStatus={chatBotVisibilityStatus}>
          <Chatbot />
        </ChatbotModal>
      )}

      {chatBotVisibilityStatus === ChatbotVisibilityStatus.minimized && (
        <MinimizedToolbar>
          <ChatbotContentWrapper
            title={headerTitle}
            onResize={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.maximized)}
            onClose={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.closed)}
            small={false}
            visibilityStatus={chatBotVisibilityStatus}
          />
        </MinimizedToolbar>
      )}
      {chatBotVisibilityStatus === ChatbotVisibilityStatus.closed && (
        <ChatbotButtonContainer onClick={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.maximized)}>
          <Circle>
            <ChatIcon src={ChatbotIcon} title={t('button')} />
          </Circle>
          {!viewportSmall && <ChatTitle>{t('button')}</ChatTitle>}
        </ChatbotButtonContainer>
      )}
    </>
  )
}

export default ChatbotContainer
