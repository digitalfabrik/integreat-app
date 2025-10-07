import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

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
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const MenuItem = ({ to, text, icon, disabled = false, tooltip, onClick }: MenuListItemProps): ReactElement => {
  const Content = (
    <>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{text}</ListItemText>
    </>
  )

  return (
    <MuiMenuItem onClick={onClick} disabled={disabled} sx={to ? { padding: 0 } : {}}>
      {to ? <StyledLink to={to}>{Content}</StyledLink> : Content}
    </MuiMenuItem>
  )
}

export default MenuItem
