import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorCode, LocalNewsModel, NewsRouteType, NewsType, TU_NEWS_TYPE, TunewsModel } from 'api-client'

import { NavigationProps } from '../constants/NavigationTypes'
import useNavigate from '../hooks/useNavigate'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import Failure from './Failure'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import NewsDetail from './NewsDetail'
import NewsListItem from './NewsListItem'

type NewsModelsType = Array<LocalNewsModel | TunewsModel>

export type NewsProps = {
  news: NewsModelsType
  navigateToNews: (newsId: string) => void
  newsId: string | null | undefined
  languageCode: string
  selectedNewsType: NewsType
  loadMore?: () => void
  loadingMore?: boolean
  refresh: () => void
}

const News = ({
  news,
  loadMore,
  newsId,
  languageCode,
  selectedNewsType,
  navigateToNews,
  refresh,
  loadingMore,
}: NewsProps): ReactElement => {
  const selectedNewsItem = newsId ? news.find(_newsItem => _newsItem.id.toString() === newsId) : null
  const { t } = useTranslation('news')

  const navigation = useNavigate().navigation as NavigationProps<NewsRouteType>
  useSetRouteTitle({ navigation, title: selectedNewsItem?.title })

  const rendersNewsListItem = ({ item, index }: { item: LocalNewsModel | TunewsModel; index: number }) => {
    const navigateToNewsDetail = () => navigateToNews(item.id.toString())

    return (
      <NewsListItem
        index={index}
        key={item.id}
        newsItem={item}
        isTunews={selectedNewsType === TU_NEWS_TYPE}
        navigateToNews={navigateToNewsDetail}
      />
    )
  }

  if (newsId) {
    if (selectedNewsItem) {
      return <NewsDetail newsItem={selectedNewsItem} language={languageCode} />
    }
    return <Failure code={ErrorCode.PageNotFound} />
  }

  return (
    <List
      items={news}
      onEndReached={loadMore}
      noItemsMessage={t('currentlyNoNews')}
      Footer={loadingMore ? <LoadingSpinner testID='loadingSpinner' /> : undefined}
      renderItem={rendersNewsListItem}
      refresh={refresh}
    />
  )
}

export default News
