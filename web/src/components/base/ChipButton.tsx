import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CloseIcon } from '../../assets'
import Button from './Button'
import Icon from './Icon'

const StyledButton = styled(Button)`
  display: flex;
  block-size: 30px;
  padding: 4px 8px;
  align-items: center;
  margin: 0 2px;
  border-radius: 20px;
  gap: 4px;
  background-color: ${props => props.theme.colors.backgroundColor};
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: 0.875rem;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.colors.textSecondaryColor};
  block-size: 16px;
  inline-size: 16px;
`

type ChipButtonProps = {
  text: string
  icon: string
  onClick: () => void
  ariaLabel?: string
  closeButton?: boolean
  className?: string
}

const ChipButton = ({ text, onClick, ariaLabel, className, ...props }: ChipButtonProps): ReactElement => (
  <StyledButton ariaLabel={ariaLabel ?? text} onClick={onClick} className={className}>
    <StyledIcon src={props.icon} />
    <div>{text}</div>
    {props.closeButton && <StyledIcon src={CloseIcon} />}
  </StyledButton>
)

export default ChipButton
