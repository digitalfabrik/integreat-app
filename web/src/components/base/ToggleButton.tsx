import styled from '@emotion/styled'
import { SvgIconProps, ToggleButton as MuiToggleButton } from '@mui/material'
import React, { ElementType, ReactElement } from 'react'

import StyledSmallViewTip from '../StyledSmallViewTip'
import Icon from './Icon'

export const toggleButtonWidth = 100

const StyledIcon = styled(Icon)<{ iconSize: 'small' | 'medium' }>`
  width: ${props => (props.iconSize === 'small' ? '24px' : '40px')};
  height: ${props => (props.iconSize === 'small' ? '24px' : '40px')};
  color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textSecondaryColor};
`

const StyledButton = styled(MuiToggleButton)`
  display: flex;
  flex-direction: column;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 25%),
    0 1px 4px 1px rgb(0 0 0 / 15%);
  border-radius: 18px;
  width: ${toggleButtonWidth}px;
  height: 100px;
  background-color: ${props => {
    if (props.theme.isContrastTheme) {
      return props.theme.colors.textColor
    }
    return props.theme.colors.backgroundColor
  }};
  color: ${props =>
    props.theme.isContrastTheme ? props.theme.colors.backgroundColor : props.theme.colors.textSecondaryColor};
  padding: 8px;
  text-align: center;

  &[class*='Mui-selected'] {
    background-color: ${props => props.theme.colors.themeColor};
  }

  /* This will disable hover issue */
  &[class*='Mui-selected']:hover {
    background-color: ${props => props.theme.colors.themeColor};
  }
`

type ToggleButtonProps = {
  text: string
  onClick?: () => void
  icon: string | ElementType<SvgIconProps>
  iconSize?: 'small' | 'medium'
  active?: boolean
  className?: string
  value?: string | number
}

const ToggleButton = ({ text, onClick, className, value, ...props }: ToggleButtonProps): ReactElement => (
  <StyledButton
    sx={{ textTransform: 'inherit' }}
    value={value ?? text}
    selected={props.active}
    onChange={onClick}
    className={className}>
    <StyledIcon iconSize={props.iconSize ?? 'small'} src={props.icon} />
    <StyledSmallViewTip as='span'>{text}</StyledSmallViewTip>
  </StyledButton>
)

export default ToggleButton
