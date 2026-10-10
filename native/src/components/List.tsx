import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, RefreshControl, ViewStyle } from 'react-native'
import { Divider } from 'react-native-paper'

import Text from './base/Text'

type ListEmptyComponentProps = { noItemsMessage: string }

export const ListEmptyComponent = ({ noItemsMessage }: ListEmptyComponentProps): ReactElement => (
  <Text variant='body2' style={{ alignSelf: 'center', marginTop: 20 }}>
    {noItemsMessage}
  </Text>
)

type ListProps<T> = {
  items: T[]
  noItemsMessage?: ReactElement | string
  renderItem: (props: { item: T; index: number }) => ReactElement
  keyExtractor: (item: T) => string
  header?: ReactElement
  footer?: ReactElement
  refresh?: () => void
  style?: ViewStyle
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
}

const List = <T,>({
  items,
  noItemsMessage,
  renderItem,
  keyExtractor,
  header,
  footer,
  refresh,
  style,
  keyboardShouldPersistTaps = 'never',
}: ListProps<T>): ReactElement => {
  const { t } = useTranslation()
  const emptyMessage = noItemsMessage ?? t($ => $.error.nothingFound)
  const listEmptyComponent =
    typeof emptyMessage === 'string' ? <ListEmptyComponent noItemsMessage={emptyMessage} /> : emptyMessage

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
      refreshControl={refresh ? <RefreshControl onRefresh={refresh} refreshing={false} /> : undefined}
      ListEmptyComponent={listEmptyComponent}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={1}
      role='list'
      style={style}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      ItemSeparatorComponent={Divider}
    />
  )
}

export default List
