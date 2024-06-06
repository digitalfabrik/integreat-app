import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { ChatbotIcon } from '../assets'
import Chatbot from './Chatbot'
import ChatbotModal from './ChatbotModal'
import ChatbotModalContent from './ChatbotModalContent'
import ToolbarItem from './ToolbarItem'

type ChatbotProps = {}

const ChatbotButtonContainer = styled.div`
  position: fixed;
  bottom: 10%;
  right: 10%;
`

const MinimizedToolbar = styled.div`
  position: fixed;
  z-index: 200;
  bottom: 0;
  right: 20px;
`

export enum ChatbotVisibilityStatus {
  closed,
  minimized,
  maximized,
}

const ChatbotContainer = (props: ChatbotProps): ReactElement => {
  const [chatBotVisibilityStatus, setChatBotVisibilityStatus] = useState<ChatbotVisibilityStatus>(
    ChatbotVisibilityStatus.closed,
  )

  return (
    <>
      {chatBotVisibilityStatus === ChatbotVisibilityStatus.maximized && (
        <ChatbotModal
          title='Integreat Chat Support'
          resizeModal={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.minimized)}
          closeModal={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.closed)}
          visibilityStatus={chatBotVisibilityStatus}>
          <Chatbot />
        </ChatbotModal>
      )}

      {chatBotVisibilityStatus === ChatbotVisibilityStatus.minimized && (
        <MinimizedToolbar>
          <ChatbotModalContent
            title='Integreat Chat Support'
            onResize={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.maximized)}
            onClose={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.closed)}
            small={false}
            visibilityStatus={chatBotVisibilityStatus}
          />
        </MinimizedToolbar>
      )}
      {chatBotVisibilityStatus === ChatbotVisibilityStatus.closed && (
        <ChatbotButtonContainer>
          <ToolbarItem
            icon={ChatbotIcon}
            text='Chat (Beta)'
            onClick={() => setChatBotVisibilityStatus(ChatbotVisibilityStatus.maximized)}
          />
        </ChatbotButtonContainer>
      )}
    </>
  )
}

export default ChatbotContainer
