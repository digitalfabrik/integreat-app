import styled from '@emotion/styled'
import React, { ReactElement } from 'react'

import StyledSmallViewTip from '../StyledSmallViewTip'
import Button from './Button'

export const toggleButtonWidth = 100

const StyledButton = styled(Button)<{ active: boolean | null }>`
  box-shadow:
    0 1px 2px rgb(0 0 0 / 25%),
    0 1px 4px 1px rgb(0 0 0 / 15%);
  border-radius: 18px;
  width: ${toggleButtonWidth}px;
  height: 100px;
  background-color: ${props => {
    if (props.active) {
      return props.theme.colors.themeColor
    }
    if (props.theme.isContrastTheme) {
      return props.theme.colors.textColor
    }
    return props.theme.colors.backgroundColor
  }};
  color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textSecondaryColor};
  padding: 8px;
  text-align: center;
`

type ToggleButtonProps = {
  text: string
  onClick: () => void
  icon: string
  active?: boolean
  className?: string
}

const ToggleButton = ({ text, onClick, className, ...props }: ToggleButtonProps): ReactElement => (
  <StyledButton onClick={onClick} active={!!props.active} label='' className={className}>
    <img src={props.icon} alt='' />
    <StyledSmallViewTip as='span'>{text}</StyledSmallViewTip>
  </StyledButton>
)

export default ToggleButton
