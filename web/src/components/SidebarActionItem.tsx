import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const StyledAvatar = styled(Avatar)({
  color: 'inherit',
})

type SidebarActionItemProps = {
  text: string
  icon: ReactElement
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void })

const SidebarActionItem = ({ text, icon, to, onClick }: SidebarActionItemProps): ReactElement => (
  <ListItem disablePadding>
    <ListItemButton dir='auto' component={to ? Link : ListItemButton} to={to} onClick={onClick}>
      <ListItemAvatar>
        <StyledAvatar>{icon}</StyledAvatar>
      </ListItemAvatar>
      <ListItemText primary={text} />
    </ListItemButton>
  </ListItem>
)

export default SidebarActionItem
