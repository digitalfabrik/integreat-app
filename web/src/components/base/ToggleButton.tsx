import { SvgIconProps } from '@mui/material/SvgIcon'
import MuiToggleButton from '@mui/material/ToggleButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ElementType, ReactElement } from 'react'

import Svg from './Svg'

export const toggleButtonWidth = 100

const StyledButton = styled(MuiToggleButton)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: toggleButtonWidth,
  height: 100,
  textAlign: 'center',
  gap: 8,
  wordBreak: 'break-word',
  hyphens: 'auto',

  ...(theme.isContrastTheme && {
    '&.Mui-selected': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  }),
}))

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
