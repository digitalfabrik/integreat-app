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
  renderNotItemsComponent: () => React$Node,
  setRef: (ref: React$Node) => void
}

const List = ({
  items,
  renderItem,
  isFetchingMore,
  getMoreItems,
  renderNotItemsComponent,
  setRef
}: ListPropTypes) => {
  function setListRef (ref: React$Node) {
    setRef && setRef(ref)
  }

  return (
    <FlatList
      data={items}
      ref={setListRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 10
      }}
      onEndReached={getMoreItems}
      ListEmptyComponent={renderNotItemsComponent}
      ListFooterComponent={isFetchingMore && <Loader size='small' />}
      onEndReachedThreshold={1}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  )
}
export default List
