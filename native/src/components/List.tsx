import React, { ReactElement } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import styled from 'styled-components/native'

const NoItemsMessage = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`

type ListProps<T> = {
  items: Array<T>
  noItemsMessage: ReactElement | string
  renderItem: (props: { item: T; index: number }) => ReactElement
  Header?: ReactElement
  Footer?: ReactElement
  refresh?: () => void
  onEndReached?: () => void
}

const List = <T,>({
  items,
  noItemsMessage,
  renderItem,
  Header,
  Footer,
  refresh,
  onEndReached,
}: ListProps<T>): ReactElement => (
  <FlatList
    data={items}
    renderItem={renderItem}
    ListHeaderComponent={Header}
    ListFooterComponent={Footer}
    ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
    refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}
    ListEmptyComponent={
      typeof noItemsMessage === 'string' ? <NoItemsMessage>{noItemsMessage}</NoItemsMessage> : noItemsMessage
    }
    onEndReached={onEndReached}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      flexGrow: 1,
      paddingHorizontal: 10,
    }}
    onEndReachedThreshold={1}
  />
)

export default List
