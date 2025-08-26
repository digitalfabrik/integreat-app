import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => ReactElement
  NoItemsMessage: string | ReactElement
  className?: string
}

const List = <T,>({ items, renderItem, NoItemsMessage, className }: ListProps<T>): ReactElement => {
  if (items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : NoItemsMessage
  }
  return <MuiList className={className}>{withDividers(items.map(renderItem))}</MuiList>
}

export default List
