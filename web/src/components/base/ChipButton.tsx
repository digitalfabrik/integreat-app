import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import { CloseIcon } from '../../assets'
import Button from './Button'
import Icon from './Icon'

const StyledButton = styled(Button)`
  display: flex;
  height: 30px;
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
  height: 16px;
  width: 16px;
`

type ChipButtonProps = {
  text: string
  icon: string
  onClick: () => void
  label?: string
  closeButton?: boolean
  className?: string
}

const ChipButton = ({ text, onClick, label, className, ...props }: ChipButtonProps): ReactElement => (
  <StyledButton label={label ?? text} onClick={onClick} className={className}>
    <StyledIcon src={props.icon} />
    <div>{text}</div>
    {props.closeButton && <StyledIcon src={CloseIcon} />}
  </StyledButton>
)

export default ChipButton
