import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ChatIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import useLockedBody from '../hooks/useLockedBody'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ChatController from './ChatController'
import ChatModal from './ChatModal'
import { TtsContext } from './TtsContainer'
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

type ChatContainerProps = {
  city: string
  language: string
}

const ChatContainer = ({ city, language }: ChatContainerProps): ReactElement => {
  const { t } = useTranslation('chat')
  const [chatVisible, setChatVisible] = useState(false)
  const { viewportSmall, visibleFooterHeight, width } = useWindowDimensions()
  const { visible: ttsPlayerVisible } = useContext(TtsContext)
  useLockedBody(chatVisible)
  const bottom =
    ttsPlayerVisible && width <= dimensions.maxTtsPlayerWidth
      ? visibleFooterHeight + dimensions.ttsPlayerHeight + CHAT_BUTTON_SIZE
      : visibleFooterHeight

  if (chatVisible) {
    return (
      <ChatModal title={t('header', { appName: buildConfig().appName })} closeModal={() => setChatVisible(false)}>
        <ChatController city={city} language={language} />
      </ChatModal>
    )
  }

  return (
    <ChatButtonContainer $bottom={bottom} data-testid='chat-button-container' onClick={() => setChatVisible(true)}>
      <Circle>
        <StyledIcon src={ChatIcon} title={t('button')} />
      </Circle>
      {!viewportSmall && <ChatTitle>{t('button')}</ChatTitle>}
    </ChatButtonContainer>
  )
}

export default ChatContainer
