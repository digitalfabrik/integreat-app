import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { useContrastTheme } from '../../hooks/useContrastTheme'
import Button from './Button'

const StyledButton = styled(Button)<{ $disabled: boolean; $isContrastTheme: boolean }>`
  margin: 16px 0;
  padding: 8px 24px;
  background-color: ${props =>
    props.$disabled ? props.theme.colors.textDisabledColor : props.theme.colors.themeColor};
  color: ${props => (props.$isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textColor)};
  text-align: center;
  font-weight: 700;
  border-radius: 0.25em;
  box-shadow:
    0 1px 3px rgb(0 0 0 / 10%),
    0 1px 2px rgb(0 0 0 / 15%);
`

type TextButtonProps = {
  text: string
  onClick: () => void
  disabled?: boolean
  className?: string
  type?: 'submit' | 'button'
}

const TextButton = ({ text, onClick, className, type, ...props }: TextButtonProps): ReactElement => {
  const { isContrastTheme } = useContrastTheme()
  return (
    <StyledButton
      onClick={onClick}
      disabled={!!props.disabled}
      $isContrastTheme={isContrastTheme}
      $disabled={!!props.disabled}
      label=''
      className={className}
      type={type}>
      {text}
    </StyledButton>
  )
}

export default TextButton
