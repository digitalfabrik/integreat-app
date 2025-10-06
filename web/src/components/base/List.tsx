import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps = {
  items: ReactElement[]
  NoItemsMessage?: string | ReactElement
  disablePadding?: boolean
  className?: string
}

const List = ({ items, NoItemsMessage, disablePadding, className }: ListProps): ReactElement | null => {
  if (items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : (NoItemsMessage ?? null)
  }
  return (
    <MuiList className={className} disablePadding={disablePadding}>
      {withDividers(items)}
    </MuiList>
  )
}

export default List
