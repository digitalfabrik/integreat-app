import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CloseIcon } from '../../assets'
import { useContrastTheme } from '../../hooks/useContrastTheme'
import Button from './Button'
import Icon from './Icon'

const StyledButton = styled(Button)<{ $isContrastTheme: boolean }>`
  display: flex;
  height: 30px;
  padding: 4px 8px;
  align-items: center;
  margin: 0 2px;
  border-radius: 20px;
  gap: 4px;
  background-color: ${props => props.theme.colors.backgroundColor};
  color: ${props => (props.$isContrastTheme ? props.theme.colors.textColor : props.theme.colors.textSecondaryColor)};
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: 0.875rem;
`

const StyledIcon = styled(Icon)<{ $isContrastTheme: boolean }>`
  color: ${props => (props.$isContrastTheme ? props.theme.colors.textColor : props.theme.colors.textSecondaryColor)};
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

const ChipButton = ({ text, onClick, label, className, ...props }: ChipButtonProps): ReactElement => {
  const { isContrastTheme } = useContrastTheme()
  return (
    <StyledButton $isContrastTheme={isContrastTheme} label={label ?? text} onClick={onClick} className={className}>
      <StyledIcon $isContrastTheme={isContrastTheme} src={props.icon} />
      <div>{text}</div>
      {props.closeButton && <StyledIcon $isContrastTheme={isContrastTheme} src={CloseIcon} />}
    </StyledButton>
  )
}

export default ChipButton
