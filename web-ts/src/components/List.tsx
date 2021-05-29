import React, { ReactNode } from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'

const StyledList = styled.div`
  border-top: 2px solid ${props => props.theme.colors.themeColor};
`

const NoItemsMessage = styled.div`
  padding-top: 25px;
  text-align: center;
`

type PropsType<T> = {
  items: Array<T>
  noItemsMessage: string
  renderItem: (item: T) => ReactNode
}

class List<T> extends React.PureComponent<PropsType<T>> {
  render() {
    const { items, renderItem, noItemsMessage } = this.props
    if (isEmpty(items)) {
      return <NoItemsMessage>{noItemsMessage}</NoItemsMessage>
    }

    return <StyledList>{items.map(item => renderItem(item))}</StyledList>
  }
}

export default List
