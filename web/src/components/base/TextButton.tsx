import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StyledButton = styled.button<{ disabled: boolean; fullWidth?: boolean }>`
  margin: 16px 0;
  padding: 8px 24px;
  background-color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.themeColor)};
  color: ${props => props.theme.colors.textColor};
  border: none;
  text-align: center;
  font-weight: 700;
  border-radius: 0.25em;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  pointer-events: ${props => (props.disabled ? 'none' : 'default')};
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.15);
`

type TextButtonProps = {
  text: string
  onClick: () => void
  disabled?: boolean
  className?: string
}

const TextButton = ({ text, onClick, className, ...props }: TextButtonProps): ReactElement => (
  <StyledButton type='button' onClick={onClick} disabled={!!props.disabled} className={className}>
    {text}
  </StyledButton>
)

export default TextButton
