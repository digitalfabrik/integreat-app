import ListItem from '@mui/material/ListItem'
import React, { ReactElement } from 'react'

import Checkbox from './base/Checkbox'

type ExternalSourcesListItemProps = {
  description: string
  allowed: boolean
  onPress: (permissionGiven: boolean) => void
}

const ExternalSourcesListItem = ({ description, allowed, onPress }: ExternalSourcesListItemProps): ReactElement => (
  <ListItem disablePadding>
    <Checkbox checked={allowed} setChecked={onPress} label={description} />
  </ListItem>
)

export default ExternalSourcesListItem
