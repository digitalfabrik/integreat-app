import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { ArrowBackIcon, CloseIcon, MaximizeIcon, MinimizeIcon } from '../assets'
import dimensions from '../constants/dimensions'
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

  @media ${dimensions.smallViewport} {
    color: ${props =>
      props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor};
  }
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
      <StyledButton label='close' onClick={onClose}>
        <StyledIcon src={ArrowBackIcon} directionDependent />
      </StyledButton>
    ) : (
      <>
        <StyledButton
          label={visibilityStatus === ChatVisibilityStatus.maximized ? 'minimize' : 'maximize'}
          onClick={onResize}>
          {' '}
          <StyledIcon
            src={visibilityStatus === ChatVisibilityStatus.maximized ? MinimizeIcon : MaximizeIcon}
            directionDependent
          />{' '}
        </StyledButton>
        <StyledButton label='close' onClick={onClose}>
          <StyledIcon src={CloseIcon} directionDependent />
        </StyledButton>
      </>
    )}
  </ButtonContainer>
)

export default ChatMenu
