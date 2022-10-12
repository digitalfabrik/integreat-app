import React, { ReactNode } from 'react'
import styled from 'styled-components'

export const StyledButton = styled.button<{ disabled: boolean }>`
  margin: 15px 0;
  padding: 8px 24px;
  background-color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.themeColor)};
  color: ${props => props.theme.colors.textColor};
  border: none;
  text-align: center;
  border-radius: 0.25em;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  pointer-events: ${props => (props.disabled ? 'none' : 'default')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);
`

type ButtonProps = {
  onClick: () => void
  text: string
  disabled?: boolean
}

class TextButton extends React.PureComponent<ButtonProps> {
  render(): ReactNode {
    const { onClick, text, disabled } = this.props
    return (
      <StyledButton onClick={onClick} disabled={!!disabled}>
        {text}
      </StyledButton>
    )
  }
}

export default TextButton
