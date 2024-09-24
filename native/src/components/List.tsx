import React, { ReactElement } from 'react'
import { FlatList, RefreshControl, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

const NoItemsMessage = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`

type ListProps<T> = {
  items: Array<T>
  noItemsMessage?: ReactElement | string
  renderItem: (props: { item: T; index: number }) => ReactElement
  Header?: ReactElement
  Footer?: ReactElement
  scrollEnabled?: boolean
  accessibilityLabel?: string
  refresh?: () => void
  onEndReached?: () => void
  style?: ViewStyle
}

const List = <T,>({
  items,
  noItemsMessage,
  renderItem,
  Header,
  Footer,
  refresh,
  accessibilityLabel,
  onEndReached,
  scrollEnabled,
  style,
}: ListProps<T>): ReactElement => (
  <FlatList
    data={items}
    renderItem={renderItem}
    ListHeaderComponent={Header}
    ListFooterComponent={Footer}
    ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
    refreshControl={refresh ? <RefreshControl onRefresh={refresh} refreshing={false} /> : undefined}
    ListEmptyComponent={
      typeof noItemsMessage === 'string' ? <NoItemsMessage>{noItemsMessage}</NoItemsMessage> : noItemsMessage
    }
    onEndReached={onEndReached}
    showsVerticalScrollIndicator={false}
    onEndReachedThreshold={1}
    scrollEnabled={scrollEnabled}
    role='list'
    accessibilityLabel={accessibilityLabel}
    style={style}
  />
)

export default List
