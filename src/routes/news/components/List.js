// @flow

import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import {
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'
import type { NewsModelsType } from '../../../modules/app/StateType'

const Loader = styled.ActivityIndicator`
  margin-top: 7px;
`
const keyExtractor = (item, index) => `${index}`

type PropType = {|
  items: NewsModelsType,
  renderItem: ({
    cityCode: string,
    language: string,
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
      ListFooterComponent={isFetchingMore && <Loader size='small' />}
      onEndReachedThreshold={1}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  )
}
export default List
