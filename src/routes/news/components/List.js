// @flow

import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import {
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'

const Loader = styled.ActivityIndicator`
  margin-top: 7px;
`
const keyExtractor = (item, index) => `${index}`

interface ListPropTypes {
  items: Array<LocalNewsModel | TunewsModel>,
  renderItem: ({
    cityCode: string,
    language: string,
    item: LocalNewsModel
  }) => React$Node,
  isFetchingMore: boolean,
  getMoreItems: () => void,
  renderNoItemsComponent: () => React$Node
}

const List = ({
  items,
  renderItem,
  isFetchingMore,
  getMoreItems,
  renderNoItemsComponent,
  setRef
}: ListPropTypes) => {
  return (
    <FlatList
      data={items}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 10
      }}
      onEndReached={getMoreItems}
      ListEmptyComponent={renderNoItemsComponent}
      ListFooterComponent={isFetchingMore && <Loader size='small' />}
      onEndReachedThreshold={1}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  )
}
export default List
