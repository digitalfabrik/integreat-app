import React, { ReactElement } from 'react'
import { FlatList, FlatListProps, RefreshControl, ViewStyle } from 'react-native'

import Text from './base/Text'

type ListProps<T> = {
  items: T[]
  noItemsMessage?: ReactElement | string
  renderItem: (props: { item: T; index: number }) => ReactElement
  header?: ReactElement
  footer?: ReactElement
  scrollEnabled?: boolean
  accessibilityLabel?: string
  refresh?: () => void
  onEndReached?: () => void
  style?: ViewStyle
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
  itemSeparatorComponent?: FlatListProps<T>['ItemSeparatorComponent']
}

const List = <T,>({
  items,
  noItemsMessage,
  renderItem,
  header,
  footer,
  refresh,
  accessibilityLabel,
  onEndReached,
  scrollEnabled,
  style,
  keyboardShouldPersistTaps = 'never',
  itemSeparatorComponent,
}: ListProps<T>): ReactElement => (
  <FlatList
    data={items}
    renderItem={renderItem}
    ListHeaderComponent={header}
    ListFooterComponent={footer}
    ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
    refreshControl={refresh ? <RefreshControl onRefresh={refresh} refreshing={false} /> : undefined}
    ListEmptyComponent={
      typeof noItemsMessage === 'string' ? (
        <Text
          variant='body2'
          style={{
            alignSelf: 'center',
            marginTop: 20,
          }}>
          {noItemsMessage}
        </Text>
      ) : (
        noItemsMessage
      )
    }
    onEndReached={onEndReached}
    showsVerticalScrollIndicator={false}
    onEndReachedThreshold={1}
    scrollEnabled={scrollEnabled}
    role='list'
    accessibilityLabel={accessibilityLabel}
    style={style}
    keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    ItemSeparatorComponent={itemSeparatorComponent}
  />
)

export default List
