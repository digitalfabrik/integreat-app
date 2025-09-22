import Divider from '@mui/material/Divider'
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
  getKey: (item: T) => string | number
}

class List<T> extends React.PureComponent<ListProps<T>> {
  render(): ReactNode {
    const { items, renderItem, noItemsMessage, borderless = false, getKey } = this.props
    if (items.length === 0) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return (
      <div>
        {!borderless && <Divider />}
        {items.map((item, index) => (
          <React.Fragment key={getKey(item)}>
            {renderItem(item, index)}
            {index < items.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    )
  }
}

export default List
