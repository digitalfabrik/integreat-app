import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ChatIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Chat from './Chat'
import ChatContentWrapper from './ChatContentWrapper'
import ChatModal from './ChatModal'
import Icon from './base/Icon'

const ChatButtonContainer = styled.button`
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

const ChatContainer = (): ReactElement => {
  const { t } = useTranslation('chat')
  const [chatVisibilityStatus, setChatVisibilityStatus] = useState<ChatVisibilityStatus>(ChatVisibilityStatus.closed)
  const { viewportSmall } = useWindowDimensions()
  const isChatMaximized = chatVisibilityStatus === ChatVisibilityStatus.maximized
  useLockedBody(isChatMaximized)
  const title = t('header', { appName: buildConfig().appName })

  if (isChatMaximized) {
    return (
      <ChatModal
        title={title}
        resizeModal={() => setChatVisibilityStatus(ChatVisibilityStatus.minimized)}
        closeModal={() => setChatVisibilityStatus(ChatVisibilityStatus.closed)}
        visibilityStatus={chatVisibilityStatus}>
        <Chat />
      </ChatModal>
    )
  }

  if (chatVisibilityStatus === ChatVisibilityStatus.minimized) {
    return (
      <MinimizedToolbar>
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
    <ChatButtonContainer onClick={() => setChatVisibilityStatus(ChatVisibilityStatus.maximized)}>
      <Circle>
        <StyledIcon src={ChatIcon} title={t('button')} />
      </Circle>
      {!viewportSmall && <ChatTitle>{t('button')}</ChatTitle>}
    </ChatButtonContainer>
  )
}

export default ChatContainer
