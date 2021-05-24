import React from 'react'
import styled from 'styled-components'

export const StyledButton = styled.button<{ disabled: boolean }>`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  border: none;
  text-align: center;
  border-radius: 0.25em;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`

type ButtonPropsType = {
  onClick: () => void
  text: string
  disabled?: boolean
}

class TextButton extends React.PureComponent<ButtonPropsType> {
  render() {
    const { onClick, text, disabled } = this.props
    return (
      <StyledButton onClick={onClick} disabled={!!disabled}>
        {text}
      </StyledButton>
    )
  }
}

export default TextButton
