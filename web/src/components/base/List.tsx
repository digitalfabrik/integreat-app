import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps = {
  items: ReactElement[]
  noItemsMessage?: string | ReactElement
  disablePadding?: boolean
  className?: string
}

const List = ({ items, noItemsMessage, disablePadding, className }: ListProps): ReactElement | null => {
  if (items.length === 0) {
    return typeof noItemsMessage === 'string' ? <Failure errorMessage={noItemsMessage} /> : (noItemsMessage ?? null)
  }
  return (
    <MuiList className={className} disablePadding={disablePadding}>
      {withDividers(items)}
    </MuiList>
  )
}

export default List
