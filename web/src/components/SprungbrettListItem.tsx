import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React, { memo, ReactElement } from 'react'

import { SprungbrettJobModel } from 'shared/api'

import { SprungbrettIcon } from '../assets'
import Link from './base/Link'
import Svg from './base/Svg'

type SprungbrettListItemProps = {
  job: SprungbrettJobModel
}

const SprungbrettListItem = ({ job }: SprungbrettListItemProps): ReactElement => (
  <ListItem disablePadding>
    <ListItemButton component={Link} to={job.url}>
      <ListItemIcon>
        <Svg src={SprungbrettIcon} width={40} height={40} />
      </ListItemIcon>
      <ListItemText primary={job.title} secondary={job.location} />
    </ListItemButton>
  </ListItem>
)

export default memo(SprungbrettListItem)
