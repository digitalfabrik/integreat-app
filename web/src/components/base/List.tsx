import MuiList from '@mui/material/List'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

type ListProps = {
  Items: ReactElement[]
  NoItemsMessage: string | ReactElement
  className?: string
}

const List = ({ Items, NoItemsMessage, className }: ListProps): ReactElement => {
  if (Items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : NoItemsMessage
  }
  return <MuiList className={className}>{withDividers(Items)}</MuiList>
}

export default List
