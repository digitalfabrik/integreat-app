// @flow

import React from 'react'
import styled from 'styled-components'

export const StyledButton = styled.button`
  margin: 15px 0;
  padding: 5px;
  background-color: ${props => props.theme.colors.themeColor};
  border: none;
  text-align: center;
  border-radius: 0.25em;
  cursor: pointer;
`

type ButtonPropsType = {
  onClick: () => void,
  text: string
}

class TextButton extends React.PureComponent<ButtonPropsType> {
  render () {
    const { onClick, text } = this.props
    return <StyledButton onClick={onClick}>{text}</StyledButton>
  }
}

export default TextButton
