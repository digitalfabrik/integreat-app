import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledMenuItem = styled(MuiMenuItem)({
  minHeight: 0,
})

const TooltipContent = styled(Stack)({
  pointerEvents: 'auto',
})

const StyledLink = styled(Link)({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  padding: '6px 16px',
  alignItems: 'center',
})

type MenuListItemProps = {
  icon?: ReactElement
  iconEnd?: ReactElement
  text: string
  disabled?: boolean
  tooltip?: string | null
  closeMenu?: () => void
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const MenuItem = ({
  to,
  text,
  icon,
  iconEnd,
  disabled = false,
  tooltip,
  onClick,
  closeMenu,
  ...otherProps
}: MenuListItemProps): ReactElement => {
  const { contentDirection } = useTheme()

  const handleClick = () => {
    closeMenu?.()
    onClick?.()
  }

  const Content = (
    <Tooltip title={tooltip}>
      <TooltipContent direction='row' width='100%'>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{text}</ListItemText>
        {iconEnd}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <StyledMenuItem
      onClick={handleClick}
      disabled={disabled}
      sx={to ? { padding: 0 } : {}}
      dir={contentDirection}
      {...otherProps}>
      {to ? <StyledLink to={to}>{Content}</StyledLink> : Content}
    </StyledMenuItem>
  )
}

export default MenuItem
