import ListItem from '@mui/material/ListItem'
import React, { ReactElement } from 'react'

import Checkbox from './base/Checkbox'

type ConsentListItemProps = {
  description: string
  allowed: boolean
  onPress: (permissionGiven: boolean) => void
}

const ConsentListItem = ({ description, allowed, onPress }: ConsentListItemProps): ReactElement => (
  <ListItem disablePadding>
    <Checkbox checked={allowed} setChecked={onPress} label={description} />
  </ListItem>
)

export default ConsentListItem
