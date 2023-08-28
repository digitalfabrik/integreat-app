import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CloseIcon } from '../../assets'
import Icon from './Icon'

const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  height: 30px;
  padding: 4px 8px;
  align-items: center;
  margin: 0 2px;
  border-radius: 20px;
  gap: 4px;
  background-color: ${props => props.theme.colors.backgroundColor};
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.native.contentFontBold};
  font-size: 14px;
  border: none;
  cursor: pointer;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
  height: 16px;
  width: 16px;
`

type ChipButtonProps = {
  text: string
  icon: string
  onClick: () => void
  closeButton?: boolean
  className?: string
}

const ChipButton = ({ text, onClick, className, ...props }: ChipButtonProps): ReactElement => (
  <StyledButton type='button' aria-label={text} onClick={onClick} className={className}>
    <StyledIcon src={props.icon} />
    <div>{text}</div>
    {props.closeButton && <StyledIcon src={CloseIcon} />}
  </StyledButton>
)

export default ChipButton
