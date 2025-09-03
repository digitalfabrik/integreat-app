import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps = {
  items: ReactElement[]
  NoItemsMessage: string | ReactElement
  className?: string
  lastDivider?: boolean
}

const List = ({ items, NoItemsMessage, className, lastDivider = true }: ListProps): ReactElement => {
  if (items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : NoItemsMessage
  }
  return <MuiList className={className}>{withDividers(items, lastDivider)}</MuiList>
}

export default List
