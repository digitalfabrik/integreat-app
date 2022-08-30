import React, { ReactElement } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import styled from 'styled-components/native'

const NoItemsMessage = styled.Text`
  padding-top: 25px;
  text-align: center;
`

type Props<T> = {
  items: Array<T>
  noItemsMessage: string
  renderItem: (props: { item: T }) => ReactElement
  Header?: ReactElement
  Footer?: ReactElement
  refresh?: () => void
}

const List = <T,>({ items, noItemsMessage, renderItem, Header, Footer, refresh }: Props<T>): ReactElement => (
  <FlatList
    data={items}
    renderItem={renderItem}
    ListHeaderComponent={Header}
    ListFooterComponent={Footer}
    refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}
    ListEmptyComponent={<NoItemsMessage>{noItemsMessage}</NoItemsMessage>}
  />
)

export default List
