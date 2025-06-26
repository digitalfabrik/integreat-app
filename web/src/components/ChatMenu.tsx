import styled from '@emotion/styled'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import dimensions from '../constants/dimensions'
import { helpers } from '../constants/theme'
import useWindowDimensions from '../hooks/useWindowDimensions'
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
    ${helpers.adaptiveThemeTextColor}
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`

type ChatMenuProps = {
  onClose: () => void
}

const ChatMenu = ({ onClose }: ChatMenuProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('common')
  return (
    <ButtonContainer>
      <StyledButton label={t(viewportSmall ? 'back' : 'minimize')} onClick={onClose}>
        <StyledIcon src={viewportSmall ? ArrowBackIosNewIcon : CloseFullscreenIcon} directionDependent />
      </StyledButton>
    </ButtonContainer>
  )
}

export default ChatMenu
