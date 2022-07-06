import React, { ReactNode } from 'react'
import styled from 'styled-components'

const StyledList = styled.div<{ borderless: boolean }>`
  border-top: 2px solid ${props => (props.borderless ? 'transparent' : props.theme.colors.themeColor)};
`

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

type PropsType<T> = {
  items: Array<T>
  noItemsMessage: string
  renderItem: (item: T) => ReactNode
  borderless?: boolean
}

class List<T> extends React.PureComponent<PropsType<T>> {
  render(): ReactNode {
    const { items, renderItem, noItemsMessage, borderless = false } = this.props
    if (items.length === 0) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return <StyledList borderless={borderless}>{items.map(item => renderItem(item))}</StyledList>
  }
}

export default List
