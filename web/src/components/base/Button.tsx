import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

const StyledButton = styled.button<{ $disabled: boolean }>`
  background-color: transparent;
  cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
  pointer-events: ${props => (props.$disabled ? 'none' : 'default')};
  padding: 0;
  border: none;
  text-align: start;
`

type ButtonProps = {
  onClick: () => void
  children: ReactNode
  label: string
  type?: 'submit' | 'button'
  disabled?: boolean
  dir?: string
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
  dir = 'auto',
  disabled = false,
  id,
}: ButtonProps): ReactElement => (
  <StyledButton
    onClick={onClick}
    disabled={disabled}
    $disabled={disabled}
    aria-label={label}
    tabIndex={tabIndex}
    type={type}
    dir={dir}
    className={className}
    id={id}>
    {children}
  </StyledButton>
)

export default Button
