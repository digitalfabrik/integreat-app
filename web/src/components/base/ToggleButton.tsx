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
  width: ${toggleButtonWidth}px;
  height: 100px;
  padding: 8px;
  text-align: center;
  border-color: ${props => props.theme.colors.textDisabledColor} !important;
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
    sx={{ textTransform: 'inherit', borderRadius: '18px !important' }}
    value={value}
    selected={props.active}
    onChange={onClick}
    className={className}>
    <StyledIcon iconSize={props.iconSize ?? 'small'} src={props.icon} />
    <StyledSmallViewTip as='span'>{text}</StyledSmallViewTip>
  </StyledButton>
)

export default ToggleButton
