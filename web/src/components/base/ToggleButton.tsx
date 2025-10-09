import { SvgIconProps } from '@mui/material/SvgIcon'
import MuiToggleButton from '@mui/material/ToggleButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement } from 'react'

import Svg from './Svg'

export const toggleButtonWidth = 100

const StyledButton = styled(MuiToggleButton)`
  display: flex;
  flex-direction: column;
  width: ${toggleButtonWidth}px;
  height: 100px;
  padding: 8px;
  text-align: center;
  gap: 8px;
`

type ToggleButtonProps = {
  text: string
  value: string | number
  onClick?: () => void
  icon: string | ElementType<SvgIconProps>
  active?: boolean
  className?: string
}

const ToggleButton = ({ text, onClick, className, value, icon: Icon, active }: ToggleButtonProps): ReactElement => (
  <StyledButton color='primary' value={value} selected={active} onChange={onClick} className={className}>
    {typeof Icon === 'string' ? <Svg src={Icon} width={40} height={40} /> : <Icon fontSize='large' />}
    <Typography variant='label2'>{text}</Typography>
  </StyledButton>
)

export default ToggleButton
