import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import { ChatbotIcon } from '../assets'
import Chatbot from './Chatbot'
import ChatbotModal from './ChatbotModal'
import ToolbarItem from './ToolbarItem'

type ChatbotProps = {}

const ChatbotButtonContainer = styled.div`
  position: fixed;
  bottom: 10%;
  right: 10%;
`

const ChatbotContainer = (props: ChatbotProps): ReactElement => {
  const [isChatBoxModalOpen, setIsChatBoxModalOpen] = useState<boolean>(false)
  return (
    <>
      {isChatBoxModalOpen && (
        <ChatbotModal title='Integreat Chat Support' closeModal={() => setIsChatBoxModalOpen(false)}>
          <Chatbot />
        </ChatbotModal>
      )}
      <ChatbotButtonContainer>
        <ToolbarItem icon={ChatbotIcon} text='Chat (Beta)' onClick={() => setIsChatBoxModalOpen(true)} />
      </ChatbotButtonContainer>
    </>
  )
}

export default ChatbotContainer
