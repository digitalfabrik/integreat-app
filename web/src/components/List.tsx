import Divider from '@mui/material/Divider'
import MUIList from '@mui/material/List'
import { styled } from '@mui/material/styles'
import React, { ReactNode } from 'react'

const NoItemsMessage = styled('div')`
  padding-top: 25px;
  text-align: center;
`

type ListProps<T> = {
  items: T[]
  noItemsMessage: string
  renderItem: (item: T, index: number) => ReactNode
  borderless?: boolean
}

class List<T> extends React.PureComponent<ListProps<T>> {
  render(): ReactNode {
    const { items, renderItem, noItemsMessage, borderless = false } = this.props
    if (items.length === 0) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <MUIList>
        {!borderless && <Divider />}
        {items.map(renderItem)}
      </MUIList>
    )
  }
}

export default List
