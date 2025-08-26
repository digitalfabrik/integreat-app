import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

const StyledButton = styled('button')<{ disabled: boolean }>`
  background-color: transparent;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  pointer-events: ${props => (props.disabled ? 'none' : 'default')};
  padding: 0;
  border: none;
  text-align: start;
`

type ButtonProps = {
  onClick: () => void
  children: ReactNode
  label?: string
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
}: ButtonProps): ReactElement => (
  <StyledButton
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    tabIndex={tabIndex}
    type={type}
    dir='auto'
    className={className}
    id={id}>
    {children}
  </StyledButton>
)

export default Button
