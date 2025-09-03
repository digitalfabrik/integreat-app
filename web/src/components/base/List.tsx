import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps = {
  Items: ReactElement[]
  NoItemsMessage?: string | ReactElement
  className?: string
}

const List = ({ Items, NoItemsMessage, className }: ListProps): ReactElement | null => {
  if (Items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : (NoItemsMessage ?? null)
  }
  return <MuiList className={className}>{withDividers(Items)}</MuiList>
}

export default List
