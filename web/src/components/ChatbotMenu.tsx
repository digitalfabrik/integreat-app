import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CloseWhiteIcon, MaximizeIcon, MinimizeIcon } from '../assets'
import { ChatbotVisibilityStatus } from './ChatbotContainer'
import Button from './base/Button'
import Icon from './base/Icon'

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.colors.themeColor};
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  align-self: center;
  display: flex;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`

type ChatbotMenuProps = {
  visibilityStatus: ChatbotVisibilityStatus
  onClose: () => void
  onResize: () => void
}
const ChatbotMenu = ({ onResize, onClose, visibilityStatus }: ChatbotMenuProps): ReactElement => {
  console.log(visibilityStatus)
  return (
    <ButtonContainer>
      <StyledButton ariaLabel='close' onClick={onResize}>
        {' '}
        <StyledIcon
          src={visibilityStatus === ChatbotVisibilityStatus.maximized ? MinimizeIcon : MaximizeIcon}
          directionDependent
        />{' '}
      </StyledButton>
      <StyledButton ariaLabel='close' onClick={onClose}>
        <StyledIcon src={CloseWhiteIcon} directionDependent />
      </StyledButton>
    </ButtonContainer>
  )
}

export default ChatbotMenu
