// @flow

import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

const Loader = styled.ActivityIndicator`
  margin-top: 7px;
`
const keyExtractor = (item, index) => `${index}`

export default ({
  items,
  renderItem,
  isFetchingMore,
  getMoreItems,
  renderNotItemsComponent,
  theme,
  status,
  setRef,
  isFetching
}) => (
  <FlatList
    data={items}
    ref={setRef}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      flexGrow: 1,
      paddingHorizontal: 10
    }}
    onEndReached={getMoreItems}
    ListEmptyComponent={status === 'success' && renderNotItemsComponent}
    ListFooterComponent={
      (isFetchingMore || isFetching) && (
        <Loader size='large' color={theme.colors.themeDarkColor} />
      )
    }
    onEndReachedThreshold={1}
    keyExtractor={keyExtractor}
    renderItem={renderItem}
  />
)
