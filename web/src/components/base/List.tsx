import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps = {
  items: ReactElement[]
  noItemsMessage?: string | ReactElement
  disablePadding?: boolean
  className?: string
  withDividers?: boolean
}

const List = ({
  items,
  noItemsMessage,
  disablePadding,
  className,
  withDividers: showDividers = true,
}: ListProps): ReactElement | null => {
  if (items.length === 0) {
    return typeof noItemsMessage === 'string' ? <Failure errorMessage={noItemsMessage} /> : (noItemsMessage ?? null)
  }
  return (
    <MuiList className={className} disablePadding={disablePadding}>
      {showDividers ? withDividers(items) : items}
    </MuiList>
  )
}

export default List
