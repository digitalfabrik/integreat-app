import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { ArrowBackIcon, CloseIcon, MaximizeIcon, MinimizeIcon } from '../assets'
import { ChatVisibilityStatus } from './ChatContainer'
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
  color: ${props => props.theme.colors.backgroundColor};
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`

type ChatMenuProps = {
  visibilityStatus: ChatVisibilityStatus
  onClose: () => void
  onResize: () => void
  small: boolean
}
const ChatMenu = ({ onResize, onClose, visibilityStatus, small }: ChatMenuProps): ReactElement => (
  <ButtonContainer>
    {small ? (
      <StyledButton ariaLabel='close' onClick={onClose}>
        <StyledIcon src={ArrowBackIcon} directionDependent />
      </StyledButton>
    ) : (
      <>
        <StyledButton ariaLabel='close' onClick={onResize}>
          {' '}
          <StyledIcon
            src={visibilityStatus === ChatVisibilityStatus.maximized ? MinimizeIcon : MaximizeIcon}
            directionDependent
          />{' '}
        </StyledButton>
        <StyledButton ariaLabel='close' onClick={onClose}>
          <StyledIcon src={CloseIcon} directionDependent />
        </StyledButton>
      </>
    )}
  </ButtonContainer>
)

export default ChatMenu
