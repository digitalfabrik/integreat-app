import React, { ReactElement, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { ChatbotVisibilityStatus } from './ChatbotContainer'
import ChatbotMenu from './ChatbotMenu'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  border-radius: 5px;
  flex: 1;
  width: 400px;
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
  ${props =>
    props.small &&
    css`
      align-self: flex-start;
      gap: 16px;
    `}
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
  return (
    <Container>
      <Header small={small}>
        <span>{title}</span>
        <ChatbotMenu onClose={onClose} onResize={onResize} visibilityStatus={visibilityStatus} />
      </Header>
      {visibilityStatus === ChatbotVisibilityStatus.maximized && children}
    </Container>
  )
}

export default ChatbotModalContent
