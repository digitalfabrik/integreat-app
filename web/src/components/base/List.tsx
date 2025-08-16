import MuiList from '@mui/material/List'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { withDividers } from '../../utils'
import Failure from '../Failure'

const StyledMuiList = styled(MuiList)({
  width: '100%',
})

type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => ReactElement
  Header?: ReactElement
  NoItemsMessage: string | ReactElement
  className?: string
}

const List = <T,>({ Header, items, renderItem, NoItemsMessage, className }: ListProps<T>): ReactElement => {
  if (items.length === 0) {
    return typeof NoItemsMessage === 'string' ? <Failure errorMessage={NoItemsMessage} /> : NoItemsMessage
  }
  return (
    <StyledMuiList className={className}>
      {Header}
      {withDividers(items.map(renderItem))}
    </StyledMuiList>
  )
}

export default List
