import styled from '@emotion/styled'
import { SvgIconProps, ToggleButton as MuiToggleButton } from '@mui/material'
import React, { ElementType, ReactElement } from 'react'

import StyledSmallViewTip from '../StyledSmallViewTip'
import Icon from './Icon'

export const toggleButtonWidth = 100

const StyledIcon = styled(Icon)<{ iconSize: 'small' | 'medium' }>`
  width: ${props => (props.iconSize === 'small' ? '24px' : '40px')};
  height: ${props => (props.iconSize === 'small' ? '24px' : '40px')};
  color: inherit;
`

const StyledButton = styled(MuiToggleButton)`
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  border: 0.5px solid gray !important;
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
`

type ToggleButtonProps = {
  text: string
  value: string | number
  onClick?: () => void
  icon: string | ElementType<SvgIconProps>
  iconSize?: 'small' | 'medium'
  active?: boolean
  className?: string
}

const ToggleButton = ({ text, onClick, className, value, ...props }: ToggleButtonProps): ReactElement => (
  <StyledButton
    color='primary'
    sx={{ textTransform: 'inherit' }}
    value={value}
    selected={props.active}
    onChange={onClick}
    className={className}>
    <StyledIcon iconSize={props.iconSize ?? 'small'} src={props.icon} />
    <StyledSmallViewTip as='span'>{text}</StyledSmallViewTip>
  </StyledButton>
)

export default ToggleButton
