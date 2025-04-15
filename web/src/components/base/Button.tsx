import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { useContrastTheme } from '../../hooks/useContrastTheme'

const StyledButton = styled.button<{ $disabled: boolean; $isContrastTheme: boolean }>`
  background-color: transparent;
  cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
  pointer-events: ${props => (props.$disabled ? 'none' : 'default')};
  padding: 0;
  border: none;
  text-align: start;
  
  &:focus {
    ${props => props.$isContrastTheme && `outline: 2px solid ${props.theme.colors.textColor}`}
`

type ButtonProps = {
  onClick: () => void
  children: ReactNode
  label: string
  type?: 'submit' | 'button'
  disabled?: boolean
  tabIndex?: number
  className?: string
  id?: string
}

const Button = ({
  onClick,
  children,
  label,
  tabIndex,
  className,
  type = 'button',
  disabled = false,
  id,
}: ButtonProps): ReactElement => {
  const { isContrastTheme } = useContrastTheme()
  return (
    <StyledButton
      onClick={onClick}
      $isContrastTheme={isContrastTheme}
      disabled={disabled}
      $disabled={disabled}
      aria-label={label}
      tabIndex={tabIndex}
      type={type}
      className={className}
      id={id}>
      {children}
    </StyledButton>
  )
}

export default Button
