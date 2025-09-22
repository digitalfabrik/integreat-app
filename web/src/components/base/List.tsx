import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps = {
  items: ReactElement[]
  NoItemsMessage?: string | ReactElement
  className?: string
  isInset?: boolean
}

const List = ({ items, NoItemsMessage, className, isInset = false }: ListProps): ReactElement | null => {
  if (items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : (NoItemsMessage ?? null)
  }
  return <MuiList className={className}>{withDividers(items, isInset)}</MuiList>
}

export default List
