import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { ChatVisibilityStatus } from './ChatContainer'
import ChatMenu from './ChatMenu'

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
  background-color: ${props => props.theme.colors.themeColor};
  padding: 4px 8px;

  @media ${dimensions.mediumLargeViewport} {
    border-start-start-radius: 5px;
    border-start-end-radius: 5px;
  }

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
  visibilityStatus: ChatVisibilityStatus
}

const ChatContentWrapper = ({
  title,
  onClose,
  onResize,
  children,
  small,
  visibilityStatus,
}: ModalProps): ReactElement => {
  const isMinimized = visibilityStatus === ChatVisibilityStatus.minimized
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
        <ChatMenu onClose={onClose} onResize={onResize} visibilityStatus={visibilityStatus} small={small} />
      </Header>
      {visibilityStatus === ChatVisibilityStatus.maximized && children}
    </Container>
  )
}

export default ChatContentWrapper
