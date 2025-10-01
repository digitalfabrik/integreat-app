import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import React, { memo, ReactElement } from 'react'

import { SprungbrettJobModel } from 'shared/api'

import { SprungbrettIcon } from '../assets'
import Link from './base/Link'

type SprungbrettListItemProps = {
  job: SprungbrettJobModel
}

const SprungbrettListItem = ({ job }: SprungbrettListItemProps): ReactElement => (
  <ListItem disablePadding>
    <ListItemButton component={Link} to={job.url}>
      <ListItemAvatar>
        <Avatar src={SprungbrettIcon} alt='' variant='square' />
      </ListItemAvatar>
      <ListItemText primary={job.title} secondary={job.location} />
    </ListItemButton>
  </ListItem>
)

export default memo(SprungbrettListItem)
