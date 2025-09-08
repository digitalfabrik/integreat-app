import MuiList from '@mui/material/List'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

const HorizontalList = styled(MuiList)`
  display: flex;
`

type ListProps = {
  items: ReactElement[]
  NoItemsMessage: string | ReactElement
  className?: string
  horizontal?: boolean
}

const List = ({ items, NoItemsMessage, className, horizontal = false }: ListProps): ReactElement => {
  if (items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : NoItemsMessage
  }
  return horizontal ? (
    <HorizontalList className={className}>{items}</HorizontalList>
  ) : (
    <MuiList className={className}>{withDividers(items)}</MuiList>
  )
}

export default List
