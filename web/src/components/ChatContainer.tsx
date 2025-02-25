import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ChatIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useTtsPlayer from '../hooks/useTtsPlayer'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ChatContentWrapper from './ChatContentWrapper'
import ChatController from './ChatController'
import ChatModal from './ChatModal'
import Icon from './base/Icon'

const CHAT_BUTTON_SIZE = 48

const ChatButtonContainer = styled.button<{ $bottom: number }>`
  position: fixed;
  bottom: ${props => props.$bottom}px;
  inset-inline-end: 32px;
  margin-bottom: 8px;
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: column;

  @media ${dimensions.smallViewport} {
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
  inset-inline-end: 20px;

  @media ${dimensions.smallViewport} {
    display: none;
  }
`

const StyledIcon = styled(Icon)`
  display: flex;
  width: 24px;
  height: 24px;
  align-self: center;
  justify-content: center;
  color: ${props => props.theme.colors.backgroundColor};

  @media ${dimensions.smallViewport} {
    width: 40px;
    height: 40px;
  }
`

const ChatTitle = styled.span`
  margin-top: 8px;
`

export enum ChatVisibilityStatus {
  closed,
  minimized,
  maximized,
}

type ChatContainerProps = {
  city: string
  language: string
}

const ChatContainer = ({ city, language }: ChatContainerProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [chatVisibilityStatus, setChatVisibilityStatus] = useState<ChatVisibilityStatus>(ChatVisibilityStatus.closed)
  const { viewportSmall, visibleFooterHeight, width } = useWindowDimensions()
  const { visible: ttsPlayerVisible } = useTtsPlayer()
  const isChatMaximized = chatVisibilityStatus === ChatVisibilityStatus.maximized
  useLockedBody(isChatMaximized)
  const title = t('header', { appName: buildConfig().appName })
  const bottom =
    ttsPlayerVisible && width <= 576
      ? visibleFooterHeight + dimensions.ttsPlayerHeight + CHAT_BUTTON_SIZE
      : visibleFooterHeight

  if (isChatMaximized) {
    return (
      <ChatModal
        data-testid='chat-modal'
        title={title}
        resizeModal={() => setChatVisibilityStatus(ChatVisibilityStatus.minimized)}
        closeModal={() => setChatVisibilityStatus(ChatVisibilityStatus.closed)}
        visibilityStatus={chatVisibilityStatus}>
        <ChatController city={city} language={language} />
      </ChatModal>
    )
  }

  if (chatVisibilityStatus === ChatVisibilityStatus.minimized) {
    return (
      <MinimizedToolbar data-testid='chat-minimized-toolbar'>
        <ChatContentWrapper
          title={title}
          onResize={() => setChatVisibilityStatus(ChatVisibilityStatus.maximized)}
          onClose={() => setChatVisibilityStatus(ChatVisibilityStatus.closed)}
          small={false}
          visibilityStatus={chatVisibilityStatus}
        />
      </MinimizedToolbar>
    )
  }

  return (
    <ChatButtonContainer
      $bottom={bottom}
      data-testid='chat-button-container'
      onClick={() => setChatVisibilityStatus(ChatVisibilityStatus.maximized)}>
      <Circle>
        <StyledIcon src={ChatIcon} title={t('button')} />
      </Circle>
      {!viewportSmall && <ChatTitle>{t('button')}</ChatTitle>}
    </ChatButtonContainer>
  )
}

export default ChatContainer
