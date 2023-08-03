import React, { ReactElement } from 'react'
import styled from 'styled-components'

import StyledSmallViewTip from './StyledSmallViewTip'

const PrimaryButton = styled.button<{ disabled: boolean; fullWidth?: boolean }>`
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.15);
`

const TileButton = styled.button<{ $active: boolean | null }>`
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px 4px 1px rgba(0, 0, 0, 0.15);
  border-radius: 18px;
  width: 100px;
  height: 80px;
  background-color: ${props => (props.$active ? props.theme.colors.themeColor : props.theme.colors.backgroundColor)};
`

type ButtonSpecificProps =
  | {
      type: 'primary'
      disabled?: boolean
    }
  | {
      type: 'tile'
      active?: boolean
    }

type ButtonProps = {
  text: string
  onClick: () => void
  icon?: string
  className?: string
} & ButtonSpecificProps

const Button = ({ icon, text, onClick, className, ...props }: ButtonProps): ReactElement => {
  switch (props.type) {
    case 'tile':
      return (
        <TileButton type='button' aria-label={text} onClick={onClick} $active={!!props.active} className={className}>
          {icon ? <img src={icon} alt='' /> : null}
          <StyledSmallViewTip>{text}</StyledSmallViewTip>
        </TileButton>
      )
    default:
      return (
        <PrimaryButton
          type='button'
          aria-label={text}
          onClick={onClick}
          disabled={!!props.disabled}
          className={className}>
          {icon ? <img src={icon} alt='' /> : null}
          {text}
        </PrimaryButton>
      )
  }
}

export default Button
