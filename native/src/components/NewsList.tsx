import React, { ReactElement } from 'react'
import { FlatList, ListRenderItem, RefreshControl } from 'react-native'

import { LocalNewsModel, TunewsModel } from 'api-client'

import LoadingSpinner from './LoadingSpinner'

const keyExtractor = (item: unknown, index: number) => `${index}`

type NewsModelsType = Array<LocalNewsModel | TunewsModel>

type PropType = {
  items: NewsModelsType
  renderItem: ListRenderItem<LocalNewsModel | TunewsModel>
  isFetchingMore: boolean
  fetchMoreItems?: () => void
  renderNoItemsComponent: React.ComponentType<unknown>
  refresh: () => void
}

const NewsList = (props: PropType): ReactElement => {
  const { items, renderItem, isFetchingMore, fetchMoreItems, renderNoItemsComponent, refresh } = props

  return (
    <FlatList
      data={items}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 10,
      }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
      onEndReached={fetchMoreItems}
      ListEmptyComponent={renderNoItemsComponent}
      ListFooterComponent={isFetchingMore ? <LoadingSpinner testID='loadingSpinner' /> : null}
      onEndReachedThreshold={1}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  )
}

export default NewsList
