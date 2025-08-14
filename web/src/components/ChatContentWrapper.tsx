import styled from '@emotion/styled'
import React, { ReactElement, ReactNode } from 'react'

import { helpers } from '../constants/theme'
import useWindowDimensions from '../hooks/useWindowDimensions'
import ChatMenu from './ChatMenu'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.legacy.fonts.web.decorativeFont};
  border-radius: 5px;
  flex: 1;
  width: 400px;

  ${props => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`

const Header = styled.div<{ small: boolean }>`
  display: flex;
  flex-direction: ${props => (props.small ? 'row-reverse' : 'row')};
  justify-content: space-between;
  ${helpers.adaptiveThemeTextColor}
  font-size: ${props => props.theme.legacy.fonts.hintFontSize};
  font-weight: bold;
  align-items: center;
  background-color: ${props => props.theme.legacy.colors.themeColor};
  padding: 4px 8px;

  ${props => props.theme.breakpoints.up('md')} {
    border-start-start-radius: 5px;
    border-start-end-radius: 5px;
  }

  ${props => props.theme.breakpoints.down('md')} {
    padding: 8px 16px;
    gap: 12px;
  }
`

type ModalProps = {
  title: string
  children: ReactNode
  onClose: () => void
}

const ChatContentWrapper = ({ title, onClose, children }: ModalProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  return (
    <Container>
      <Header small={viewportSmall}>
        {title}
        <ChatMenu onClose={onClose} />
      </Header>
      {children}
    </Container>
  )
}

export default ChatContentWrapper
