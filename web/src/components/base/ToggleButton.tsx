import styled from '@emotion/styled'
import { SvgIconProps } from '@mui/material/SvgIcon'
import MuiToggleButton from '@mui/material/ToggleButton'
import React, { ElementType, ReactElement } from 'react'

import Icon from './Icon'

export const toggleButtonWidth = 100

const StyledIcon = styled(Icon)`
  width: 40px;
  height: 40px;
  color: inherit;
`

const StyledButton = styled(MuiToggleButton)`
  display: flex;
  flex-direction: column;
  width: ${toggleButtonWidth}px;
  height: 100px;
  padding: 8px;
  text-align: center;
`

const StyledLabel = styled.span`
  line-height: 1;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 0;
  margin-top: 8px;
  word-break: break-word;
`

type ToggleButtonProps = {
  text: string
  value: string | number
  onClick?: () => void
  icon: string | ElementType<SvgIconProps>
  active?: boolean
  className?: string
}

const ToggleButton = ({ text, onClick, className, value, ...props }: ToggleButtonProps): ReactElement => (
  <StyledButton color='primary' value={value} selected={props.active} onChange={onClick} className={className}>
    <StyledIcon src={props.icon} />
    <StyledLabel>{text}</StyledLabel>
  </StyledButton>
)

export default ToggleButton
