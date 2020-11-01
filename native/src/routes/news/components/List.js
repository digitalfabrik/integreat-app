// @flow

import React from 'react'
import { FlatList } from 'react-native'
import { LocalNewsModel, TunewsModel } from 'api-client'
import type { NewsModelsType } from '../../../modules/app/StateType'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'

const keyExtractor = (item, index) => `${index}`

type PropType = {|
  items: NewsModelsType,
  renderItem: ({
    item: LocalNewsModel | TunewsModel
}) => React$Node,
  isFetchingMore: boolean,
  fetchMoreItems: () => void,
  renderNoItemsComponent: () => React$Node
|}

const List = ({
  items,
  renderItem,
  isFetchingMore,
  fetchMoreItems,
  renderNoItemsComponent
}: PropType) => {
  return (
    <FlatList
      data={items}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 10
      }}
      onEndReached={fetchMoreItems}
      ListEmptyComponent={renderNoItemsComponent}
      ListFooterComponent={isFetchingMore ? <LoadingSpinner /> : null}
      onEndReachedThreshold={1}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  )
}
export default List
