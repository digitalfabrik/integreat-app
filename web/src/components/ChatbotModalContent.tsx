import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { ChatbotVisibilityStatus } from './ChatbotContainer'
import ChatbotMenu from './ChatbotMenu'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  border-radius: 5px;
  flex: 1;
  width: 400px;

  @media ${dimensions.smallViewport} {
    width: 100%;
  }
`

const Header = styled.div<{ small: boolean }>`
  display: flex;
  flex-direction: ${props => (props.small ? 'row-reverse' : 'row')};
  justify-content: space-between;
  font-size: ${props => props.theme.fonts.hintFontSize};
  font-weight: bold;
  align-items: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  padding: 4px 8px;

  @media ${dimensions.smallViewport} {
    padding: 8px 16px;
    gap: 12px;
  }
`

const Title = styled.span<{ isClickable: boolean }>`
  flex: 1;
  cursor: ${props => (props.isClickable ? 'pointer' : 'auto')};
`

type ModalProps = {
  title: string
  children?: ReactNode
  onClose: () => void
  onResize: () => void
  small: boolean
  visibilityStatus: ChatbotVisibilityStatus
}

const ChatbotModalContent = ({
  title,
  onClose,
  onResize,
  children,
  small,
  visibilityStatus,
}: ModalProps): ReactElement => {
  const isMinimized = visibilityStatus === ChatbotVisibilityStatus.minimized
  return (
    <Container>
      <Header small={small}>
        <Title
          isClickable={isMinimized}
          onClick={isMinimized ? onResize : undefined}
          role='button'
          onKeyDown={isMinimized ? onResize : undefined}
          tabIndex={0}>
          {title}
        </Title>
        <ChatbotMenu onClose={onClose} onResize={onResize} visibilityStatus={visibilityStatus} small={small} />
      </Header>
      {visibilityStatus === ChatbotVisibilityStatus.maximized && children}
    </Container>
  )
}

export default ChatbotModalContent
