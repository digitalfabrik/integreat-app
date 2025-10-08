import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledMenuItem = styled(MuiMenuItem)({
  minHeight: 0,
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
  text: string
  disabled?: boolean
  tooltip?: string | null
  closeMenu?: () => void
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const MenuItem = ({
  to,
  text,
  icon,
  disabled = false,
  tooltip,
  onClick,
  closeMenu,
}: MenuListItemProps): ReactElement => {
  const { contentDirection } = useTheme()

  const handleClick = () => {
    closeMenu?.()
    onClick?.()
  }

  const Content = (
    <>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{text}</ListItemText>
    </>
  )

  return (
    <Tooltip title={tooltip}>
      <div>
        <StyledMenuItem onClick={handleClick} disabled={disabled} sx={to ? { padding: 0 } : {}} dir={contentDirection}>
          {to ? <StyledLink to={to}>{Content}</StyledLink> : Content}
        </StyledMenuItem>
      </div>
    </Tooltip>
  )
}

export default MenuItem
