import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import useWindowDimensions from '../hooks/useWindowDimensions'
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

const Header = styled.div<{ $small: boolean }>`
  display: flex;
  flex-direction: ${props => (props.$small ? 'row-reverse' : 'row')};
  justify-content: space-between;
  ${helpers.adaptiveThemeTextColor}
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

type ModalProps = {
  title: string
  children: ReactNode
  onClose: () => void
}

const ChatContentWrapper = ({ title, onClose, children }: ModalProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  return (
    <Container>
      <Header $small={viewportSmall}>
        {title}
        <ChatMenu onClose={onClose} />
      </Header>
      {children}
    </Container>
  )
}

export default ChatContentWrapper
