import React, { ReactElement } from 'react'
import { FlatList, ListRenderItem, RefreshControl } from 'react-native'
import { LocalNewsModel, NEWS_ROUTE, NewsType, RouteInformationType, TunewsModel } from 'api-client'
import { NewsModelsType } from '../redux/StateType'
import LoadingSpinner from './LoadingSpinner'

const keyExtractor = (item: unknown, index: number) => `${index}`

type PropType = {
  items: NewsModelsType
  renderItem: ListRenderItem<LocalNewsModel | TunewsModel>
  isFetchingMore: boolean
  fetchMoreItems: () => void
  renderNoItemsComponent: React.ComponentType<unknown>
  routeKey: string
  navigateTo: (arg0: RouteInformationType, arg1: string, arg2: boolean) => void
  selectedNewsType: NewsType
  newsId: string | null | undefined
  cityCode: string
  language: string
}

const NewsList = (props: PropType): ReactElement => {
  const { items, renderItem, isFetchingMore, fetchMoreItems, renderNoItemsComponent } = props

  function onRefresh() {
    const { routeKey, navigateTo, cityCode, language, newsId, selectedNewsType } = props
    navigateTo(
      {
        route: NEWS_ROUTE,
        cityCode,
        newsType: selectedNewsType,
        languageCode: language,
        newsId: newsId || undefined
      },
      routeKey,
      true
    )
  }

  return (
    <FlatList
      data={items}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 10
      }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      onEndReached={fetchMoreItems}
      ListEmptyComponent={renderNoItemsComponent}
      ListFooterComponent={isFetchingMore ? <LoadingSpinner /> : null}
      onEndReachedThreshold={1}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  )
}

export default NewsList
