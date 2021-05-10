import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { LocalNewsModel, NEWS_ROUTE, TunewsModel } from 'api-client'
import { NewsType, RouteInformationType } from 'api-client'
import { NewsModelsType } from '../../../modules/app/StateType'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'

const keyExtractor = (item, index) => `${index}`

type PropType = {
  items: NewsModelsType
  renderItem: (arg0: { item: LocalNewsModel | TunewsModel }) => React.ReactNode
  isFetchingMore: boolean
  fetchMoreItems: () => void
  renderNoItemsComponent: () => React.ReactNode
  routeKey: string
  navigateTo: (arg0: RouteInformationType, arg1: string, arg2: boolean) => void
  selectedNewsType: NewsType
  newsId: string | null | undefined
  cityCode: string
  language: string
}

const NewsList = (props: PropType) => {
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
